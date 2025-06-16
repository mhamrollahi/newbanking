const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('jalali-moment');
const { sequelize, models } = require('@models/');
const progressTracker = require('../../utils/progressTracker');

exports.importCodingData = async (req, res, next) => {
  try {
    console.log('=== Starting importCodingData ===');
    const errorFilePath = req.flash('errorFilePath')[0];
    const errorMessage = req.flash('errorMessage')[0];

    console.log('Flash values:', { errorFilePath, errorMessage });

    const [tables] = await sequelize.query('SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();');
    const tableNames = tables.map((t) => ({ name: t.TABLE_NAME }));

    console.log('About to render with:', { errorFilePath, errorMessage });

    res.adminRender('./importFiles/importCodingData', {
      errorFilePath,
      errorMessage,
      tables: tableNames
    });
  } catch (error) {
    next(error);
  }
};

// New endpoint to get import progress
exports.getImportProgress = async (req, res) => {
  console.log('=== Controller: getImportProgress called ===');
  try {
    const progress = progressTracker.getProgress();

    // اگر عملیات تمام شده، وضعیت completed را برگردان
    if (progress.isCompleted || progress.status === 'completed') {
      return res.json({
        success: true,
        current: progress.total,
        total: progress.total,
        status: 'completed',
        isCompleted: true,
        phase: progress.phase,
        percent: 100
      });
    }

    return res.json({
      success: true,
      current: progress.current,
      total: progress.total,
      status: progress.status,
      isCompleted: progress.isCompleted,
      phase: progress.phase,
      percent: progress.percent
    });
  } catch (error) {
    console.error('Error in getProgress:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت وضعیت پیشرفت'
    });
  }
};

exports.importCodingData_Save = async (req, res) => {
  console.log('=== Starting import process ===');

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('Total records to process:', sheetData.length);

    // شروع عملیات با وضعیت "در حال اعتبارسنجی" و تعداد کل رکوردها
    progressTracker.startProgress('validating', sheetData.length);

    const validateExcelFileResult = await validateExcelFile(req.file);
    if (validateExcelFileResult) {
      console.log('Excel validation failed:', validateExcelFileResult);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);

      progressTracker.setError();
      return res.status(400).json({
        success: false,
        message: validateExcelFileResult.errors
      });
    }

    // Get the selected table name
    const tableName = req.body.tableName;
    console.log('Selected table:', tableName);

    // Get table structure from database
    const [columns] = await sequelize.query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = ?`,
      {
        replacements: [tableName]
      }
    );

    // Validate each row based on table structure
    console.log('Starting row validation...');
    let errorRows = [];
    for (const [index, row] of sheetData.entries()) {
      const validationResult = await validateRow(row, index, columns);
      if (validationResult) {
        console.log(`Row ${index + 1} has errors:`, validationResult);
        errorRows.push(validationResult);
      }
      progressTracker.updateProgress(index + 1, sheetData.length);
    }

    if (errorRows.length > 0) {
      console.log(`Found ${errorRows.length} rows with errors`);
      const errorFilePath = createErrorSheet(errorRows, req.file.originalname);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);

      progressTracker.setError();
      return res.status(400).json({
        success: false,
        message: `تعداد ${errorRows.length} سطر دارای خطا می‌باشد`,
        errorFilePath: errorFilePath,
        errors: errorRows
      });
    }

    // Find the model by matching table name
    const Model = Object.values(models).find((model) => {
      const modelTableName = model.getTableName();
      return modelTableName.toLowerCase() === tableName.toLowerCase();
    });

    if (!Model) {
      progressTracker.setError();
      throw new Error(`Model for table ${tableName} not found`);
    }

    console.log('Model found:', Model.name);

    // شروع عملیات درج با همان تعداد کل رکوردها
    progressTracker.startProgress('importing', sheetData.length);

    // تنظیم سایز دسته
    const batchSize = sheetData.length <= 500 ? 1 : 50;
    const batchDelay = sheetData.length <= 500 ? 0 : 50;
    const batches = [];

    for (let i = 0; i < sheetData.length; i += batchSize) {
      batches.push(sheetData.slice(i, i + batchSize));
    }

    console.log(`Divided data into ${batches.length} batches. Using batch delay: ${batchDelay}ms`);

    let totalProcessed = 0;
    let dbErrors = []; // برای ذخیره خطاهای دیتابیس

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchPromises = batch.map((row, idx) => {
        return async () => {
          try {
            let processedRow = { ...row }; // کپی از داده‌ها برای پردازش

            // Special handling for bankbranch table
            if (Model.name === 'BankBranch' && processedRow.cityName) {
              // Find the corresponding organization by budgetRow
              const city = await models.CityModel.findOne({
                where: { cityName: processedRow.cityName }
              });

              if (city) {
                processedRow.cityId = city.id;
              }else{
                processedRow.cityId = 663 // یه شهر نامشخص
              }

            }


            // Special handling for codeonlies table
            if (Model.name === 'CodeOnline' && processedRow.orgStructure) {
              // Find the corresponding organization by budgetRow
              const organization = await models.OrganizationMasterDataModel.findOne({
                where: { budgetRow: processedRow.orgStructure }
              });

              if (organization) {
                processedRow.organizationId = organization.id;
              }
              // Remove orgStructure field from row object
              delete processedRow.orgStructure;
              // If organization not found, we'll still create the record but with null organizationId
            }

            // Convert numeric strings to actual numbers for specific fields
            if (Model.name === 'CodeOnline') {
              console.log('Before conversion row = ', JSON.stringify(processedRow, null, 2));
              // Convert potential numeric string values to numbers
              if (processedRow.value !== undefined) processedRow.value = Number(processedRow.value);
              if (processedRow.organizationId !== undefined) processedRow.organizationId = Number(processedRow.organizationId);
              // Convert code to string if it exists
              if (processedRow.code !== undefined) processedRow.code = String(processedRow.code);
              console.log('After conversion row = ', JSON.stringify(processedRow, null, 2));
            }

            // Convert numeric strings to actual numbers for specific fields
            if (Model.name === 'BankBranch') {

              if (processedRow.cityId !== undefined) processedRow.cityId = Number(processedRow.cityId);
              if (processedRow.contactTel !== undefined) processedRow.contactTel = String(processedRow.contactTel);
              if (processedRow.branchCode !== undefined) processedRow.branchCode = String(processedRow.branchCode);
            }

            if (Model.name === 'OrganizationMasterData' && processedRow.parentOrganizationId) {
              const parentExists = await Model.findOne({
                where: { id: processedRow.parentOrganizationId }
              });
              if (!parentExists) {
                processedRow.parentOrganizationId = null;
              }
            }
            console.log('row = ', processedRow);

            await Model.create({
              ...processedRow,
              createdAt: new Date(),
              creatorId: req.session?.user?.id ?? 0
            });

          } catch (error) {
            console.error('Error creating record:', error);
            let errorMessage = 'خطای نامشخص در ذخیره‌سازی';

            if (error.name === 'SequelizeUniqueConstraintError') {
              const field = error.errors[0]?.path || 'نامشخص';
              errorMessage = `خطای یکتایی: مقدار تکراری برای فیلد ${field}`;
            } else if (error.name === 'SequelizeValidationError') {
              errorMessage = error.errors.map((e) => e.message).join(', ');
            }

            // اضافه کردن شماره سطر اصلی از فایل اکسل و داده‌های اصلی
            const originalRowIndex = i * batchSize + idx + 1;
            const originalData = { ...row }; // کپی از داده‌های اصلی قبل از هرگونه تغییر

            // حذف فیلدهای اضافی که ممکن است در طول پردازش اضافه شده باشند
            delete originalData.createdAt;
            delete originalData.updatedAt;
            delete originalData.creatorId;
            delete originalData.updaterId;

            console.log('Original Data for error file:', originalData); // برای دیباگ

            dbErrors.push({
              Row: originalRowIndex,
              Errors: `خطای دیتابیس: ${errorMessage}`,
              OriginalData: originalData,
              ErrorType: 'Database Error'
            });
          }
        };
      });

      await Promise.all(batchPromises.map((fn) => fn()));
      totalProcessed += batch.length;
      progressTracker.updateProgress(totalProcessed, sheetData.length);

      if (i < batches.length - 1 && batchDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, batchDelay));
      }
    }

    // اگر خطای دیتابیس وجود داشت، فایل خطا ایجاد کن
    if (dbErrors.length > 0) {
      const errorFilePath = createErrorSheet(dbErrors, req.file.originalname);
      progressTracker.completeProgress();
      return res.status(400).json({
        success: false,
        message: `تعداد ${dbErrors.length} سطر به دلیل خطای دیتابیس ذخیره نشدند`,
        errorFilePath: errorFilePath,
        errors: dbErrors
      });
    }

    const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
    deleteUploadedFile(filePath);

    progressTracker.completeProgress();

    return res.json({
      success: true,
      message: 'اطلاعات با موفقیت در سامانه ذخیره شد.'
    });
  } catch (error) {
    console.error('Error in import process:', error);
    progressTracker.setError();

    return res.status(500).json({
      success: false,
      message: 'خطا در پردازش فایل: ' + error.message
    });
  }
};

const validateExcelFile = async (file) => {
  if (!file.mimetype.includes('spreadsheet')) {
    return {
      isValid: false,
      errors: ' فرمت فایل می‌بایست اکسل باشد. !فرمت فایل معتبر نیست'
    };
  }
  return null;
};

const deleteUploadedFile = async (filePath) => {
  await fs.unlinkSync(filePath);
  console.log(`فایل ${filePath} با موفقیت حدف شد.....`);
};

exports.downloadErrorFile = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../../../', req.query.filePath);
    const fileName = path.basename(filePath);

    console.log('filePath = ', filePath, ' ;fileName = ', fileName);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('خطا در ارسال فایل خطا', err);
        return res.status(500).send('مشکلی در دانلود فایل رخ داده است.');
      }
    });
  } catch (error) {
    next(error);
  }
};

const createErrorSheet = (_errorSheet, _filename) => {
  try {
    console.log('Creating error sheet with data:', JSON.stringify(_errorSheet, null, 2));

    // Make sure the errors directory exists
    const errorDir = path.join(__dirname, '../../../uploads/errors');
    if (!fs.existsSync(errorDir)) {
      fs.mkdirSync(errorDir, { recursive: true });
    }

    const errorWorkbook = xlsx.utils.book_new();
    const errorWorksheet = xlsx.utils.json_to_sheet(_errorSheet);
    xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, 'Errors');

    // ایجاد نام فایل با فرمت: errors_[نام-فایل-اصلی]_[تاریخ].xlsx
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const sanitizedFileName = _filename.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-');
    const errorFileName = `errors_${sanitizedFileName}_${timestamp}.xlsx`;
    const errorFilePath = path.join(errorDir, errorFileName);

    console.log('Writing error file to:', errorFilePath);

    xlsx.writeFile(errorWorkbook, errorFilePath);
    console.log('Error file created successfully');

    // Return relative path for the response (using forward slashes for URLs)
    return `uploads/errors/${errorFileName}`;
  } catch (error) {
    console.error('Error creating error sheet:', error);
    throw error;
  }
};

const validateRow = async (row, index, columns) => {
  const errors = [];

  for (const column of columns) {
    const columnName = column.COLUMN_NAME;
    const value = row[columnName];

    // Skip validation for auto-generated columns
    if (['id', 'createdAt', 'updatedAt', 'creatorId', 'updaterId'].includes(columnName)) {
      continue;
    }

    // Check required fields
    if (column.IS_NULLABLE === 'NO' && !value) {
      errors.push(`فیلد ${columnName} الزامی است`);
      continue;
    }

    // Validate data types
    if (value) {
      switch (column.DATA_TYPE) {
        case 'int':
        case 'bigint':
        case 'tinyint':
          if (isNaN(value)) {
            errors.push(`فیلد ${columnName} باید عددی باشد`);
          }
          break;

        case 'text':
        case 'varchar':
          // Accept any value for text and varchar fields
          break;

        case 'datetime':
        case 'timestamp': {
          const dateError = validateDate(value);
          if (dateError) {
            errors.push(`فیلد ${columnName}: ${dateError}`);
          }
          break;
        }
        case 'decimal':
        case 'float':
        case 'double':
          if (isNaN(parseFloat(value))) {
            errors.push(`فیلد ${columnName} باید عدد اعشاری باشد`);
          }
          break;
      }
    }
  }

  if (errors.length > 0) {
    return {
      Row: index + 1,
      Errors: errors.join(', '),
      OriginalData: row
    };
  }

  return null;
};

const validateDate = (date) => {
  const allowedFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss.SSS', 'YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY'];

  const isValid = allowedFormats.some((format) => moment(date, format, true).isValid());

  if (!isValid) return 'تاریخ باید در فرمت YYYY-MM-DD , YYYY-MM-DD HH:mm:ss.SSS یا YYYY-MM-DD HH:mm:ss';

  return null;
};
