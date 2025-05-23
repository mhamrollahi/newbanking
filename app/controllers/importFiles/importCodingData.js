const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('jalali-moment');
const { sequelize, models } = require('@models/');

// Store import progress
const importProgress = new Map();

exports.importCodingData = async (req, res, next) => {
  try {
    // const success = req.flash("success");
    // const errors = req.flash("errors");
    const errorFilePath = req.flash('errorFilePath');

    // Get all tables from database
    const [tables] = await sequelize.query('SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();');

    console.log('Database tables:', tables);
    const tableNames = tables.map((t) => ({ name: t.TABLE_NAME }));
    console.log('Mapped table names:', tableNames);

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
  const importId = req.query.importId;
  console.log('Getting progress for importId:', importId);
  const progress = importProgress.get(importId) || { total: 0, current: 0, status: 'idle' };
  console.log('Current progress state:', {
    importId,
    total: progress.total,
    current: progress.current,
    status: progress.status,
    message: progress.message
  });
  res.json(progress);
};

exports.importCodingData_Save = async (req, res, next) => {
  const importId = Date.now().toString();
  console.log('Starting import with importId:', importId);
  importProgress.set(importId, { total: 0, current: 0, status: 'processing' });
  console.log('Initial progress state set:', importProgress.get(importId));

  try {
    const validateExcelFileResult = await validateExcelFile(req.file);
    if (validateExcelFileResult) {
      console.log('Excel validation failed:', validateExcelFileResult);
      req.flash('errors', validateExcelFileResult.errors);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);
      importProgress.set(importId, { total: 0, current: 0, status: 'error', message: validateExcelFileResult.errors });
      return res.redirect('/importFiles/importCodingData');
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('Total rows to process:', sheetData.length);

    // Update total count
    importProgress.set(importId, {
      total: sheetData.length,
      current: 0,
      status: 'processing'
    });
    console.log('Updated progress with total rows:', {
      importId,
      total: sheetData.length,
      current: 0,
      status: 'processing'
    });

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
      // Update progress
      const currentProgress = {
        total: sheetData.length,
        current: index + 1,
        status: 'processing'
      };
      importProgress.set(importId, currentProgress);
      console.log('Progress update during validation:', {
        importId,
        ...currentProgress
      });
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
      req.flash('errorFilePath', errorFilePath);
      const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
      deleteUploadedFile(filePath);
      importProgress.set(importId, {
        total: sheetData.length,
        current: sheetData.length,
        status: 'error',
        message: 'Validation errors found'
      });
      return res.redirect('/importFiles/importCodingData');
    }

    // Find the model by matching table name with model's table name
    const Model = Object.values(models).find((model) => {
      const modelTableName = model.getTableName();
      console.log('Model Table Name:', modelTableName);
      return modelTableName.toLowerCase() === tableName.toLowerCase();
    });

    if (!Model) {
      throw new Error(`Model for table ${tableName} not found. Available models: ${Object.keys(models).join(', ')}`);
    }

    // Insert data into the selected table
    for (const [index, row] of sheetData.entries()) {
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

      await Model.create({
        ...row,
        createdAt: new Date(),
        creatorId: req.session?.user?.id ?? 0
      });

      // Update progress
      const currentProgress = {
        total: sheetData.length,
        current: index + 1,
        status: 'processing'
      };
      importProgress.set(importId, currentProgress);
      console.log('Progress update during data insertion:', {
        importId,
        ...currentProgress
      });
    }

    importProgress.set(importId, {
      total: sheetData.length,
      current: sheetData.length,
      status: 'completed'
    });

    req.flash('success', 'اطلاعات با موفقیت در سامانه ذخیره شد.');

    const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
    deleteUploadedFile(filePath);
    res.json({
      success: true,
      message: 'اطلاعات با موفقیت در سامانه ذخیره شد.',
      importId: importId
    });
  } catch (error) {
    console.log('error = ', error);
    importProgress.set(importId, {
      total: 0,
      current: 0,
      status: 'error',
      message: error.message
    });
    res.json({
      success: false,
      message: 'خطا در ذخیره‌سازی اطلاعات: ' + error.message,
      importId: importId
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
        case 'timestamp':
          const dateError = validateDate(value);
          if (dateError) {
            errors.push(`فیلد ${columnName}: ${dateError}`);
          }
          break;
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
