const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('jalali-moment');
const { sequelize, models } = require('@models/');
const progressTracker = require('../../utils/progressTracker');

exports.importCodingData = async (req, res, next) => {
  try {
    // const success = req.flash("success");
    // const errors = req.flash("errors");
    const errorFilePath = req.flash('errorFilePath');

    // Get all tables from database
    const [tables] = await sequelize.query('SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();');

    // console.log('Database tables:', tables);
    const tableNames = tables.map((t) => ({ name: t.TABLE_NAME }));
    // console.log('Mapped table names:', tableNames);

    res.adminRender('./importFiles/importCodingData', {
      errorFilePath,
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
      return res.json({
        success: false,
        message: validateExcelFileResult.errors
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('=== STARTING DATA INSERTION ===');
    console.log('Total records to process:', sheetData.length);

    // شروع progress tracker با تعداد کل رکوردها
    progressTracker.startProgress();
    progressTracker.updateProgress(0, sheetData.length);

    const fileName = req.file.originalname;
    let errorSheet = null;
    let errorRows = [];

    // Get the selected table name
    const tableName = req.body.tableName;

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
    for (const [index, row] of sheetData.entries()) {
      const validationResult = await validateRow(row, index, columns);
      if (validationResult) {
        errorRows.push(validationResult);
      }
    }

    if (errorRows.length > 0) {
      errorSheet = errorRows.map((row) => ({
        Row: row.Row,
        Errors: row.Errors,
        ...row.OriginalData
      }));
    }

    if (errorSheet) {
      const errorFilePath = createErrorSheet(errorSheet, fileName);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);
      return res.json({
        success: false,
        message: 'Validation errors found',
        errorFilePath: errorFilePath
      });
    }

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
        console.log('Current index:', i);
        console.log('Current row:', row);
        
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

        // اضافه کردن تاخیر برای نمایش بهتر نوار پیشرفت
        const delay = sheetData.length < 100 ? 700 : 200;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log('=== INSERT LOOP COMPLETED ===');
    // تکمیل پیشرفت
    progressTracker.completeProgress();

    req.flash('success', 'اطلاعات با موفقیت در سامانه ذخیره شد.');

    const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
    deleteUploadedFile(filePath);

    return res.json({
      success: true,
      message: 'اطلاعات با موفقیت در سامانه ذخیره شد.'
    });
  } catch (error) {
    console.log('error = ', error);
    // در صورت خطا، وضعیت پیشرفت را به حالت خطا تغییر می‌دهیم
    progressTracker.setError();
    res.json({
      success: false,
      message: 'خطا در ذخیره‌سازی اطلاعات: ' + error.message
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
  const errorWorkbook = xlsx.utils.book_new();
  const errorWorksheet = xlsx.utils.json_to_sheet(_errorSheet);
  xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, 'Errors');

  const errorFilePath = `uploads/errors/errors_${_filename.split('.')[0]}_${Date.now()}.xlsx`;
  xlsx.writeFile(errorWorkbook, errorFilePath);
  return errorFilePath;
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
