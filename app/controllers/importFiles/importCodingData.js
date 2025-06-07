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
    // console.log('Current progress from tracker:', progress);

    return res.json({
      success: true,
      current: progress.current,
      total: progress.total,
      status: progress.status
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
    const validateExcelFileResult = await validateExcelFile(req.file);
    if (validateExcelFileResult) {
      console.log('Excel validation failed:', validateExcelFileResult);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);

      return res.status(400).json({
        success: false,
        message: validateExcelFileResult.errors
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('=== STARTING DATA VALIDATION ===');
    console.log('Total records to process:', sheetData.length);

    const fileName = req.file.originalname;
    let errorRows = [];

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
    for (const [index, row] of sheetData.entries()) {
      const validationResult = await validateRow(row, index, columns);
      if (validationResult) {
        console.log(`Row ${index + 1} has errors:`, validationResult);
        errorRows.push(validationResult);
      }
    }

    if (errorRows.length > 0) {
      console.log(`Found ${errorRows.length} rows with errors`);
      const errorFilePath = createErrorSheet(errorRows, fileName);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);

      console.log('Sending error response:', {
        success: false,
        message: `تعداد ${errorRows.length} سطر دارای خطا می‌باشد`,
        errorFilePath: errorFilePath,
        errors: errorRows
      });

      return res.status(400).json({
        success: false,
        message: `تعداد ${errorRows.length} سطر دارای خطا می‌باشد`,
        errorFilePath: errorFilePath,
        errors: errorRows
      });
    }

    // اگر خطایی نبود، شروع عملیات درج در دیتابیس
    progressTracker.startProgress();
    progressTracker.updateProgress(0, sheetData.length);

    // Find the model by matching table name with model's table name
    const Model = Object.values(models).find((model) => {
      const modelTableName = model.getTableName();
      return modelTableName.toLowerCase() === tableName.toLowerCase();
    });

    if (!Model) {
      throw new Error(`Model for table ${tableName} not found. Available models: ${Object.keys(models).join(', ')}`);
    }

    console.log('Model found:', Model.name);

    // Insert data into the selected table
    console.log('\n=== STARTING INSERT LOOP ===');

    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];
      console.log(`\n=== LOOP ITERATION ${i} ===`);

      if (Model.name === 'OrganizationMasterData') {
        if (row.parentOrganizationId) {
          const parentExists = await Model.findOne({
            where: { id: row.parentOrganizationId }
          });

          if (!parentExists) {
            row.parentOrganizationId = null;
          }
        }
      }

      console.log('About to create record...');
      const createdRecord = await Model.create({
        ...row,
        createdAt: new Date(),
        creatorId: req.session?.user?.id ?? 0
      });
      console.log('Record created with ID:', createdRecord.id);

      // به‌روزرسانی پیشرفت
      progressTracker.updateProgress(i + 1, sheetData.length);
    }

    console.log('=== INSERT LOOP COMPLETED ===');
    progressTracker.completeProgress();

    const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
    deleteUploadedFile(filePath);

    return res.json({
      success: true,
      message: 'اطلاعات با موفقیت در سامانه ذخیره شد.'
    });
  } catch (error) {
    console.log('error = ', error);
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
