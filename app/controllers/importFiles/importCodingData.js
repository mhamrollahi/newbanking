const xlsx = require("xlsx");
const { CodingDataModel } = require("../../models");
const path = require("path");
const fs = require("fs");
const moment = require('jalali-moment')

exports.importCodingData = (req, res, next) => {
  try {
    const success = req.flash("success");
    const errors = req.flash("errors");
    const errorFilePath = req.flash("errorFilePath");

    console.log("errorFilePath = ", errorFilePath);

    res.render("./importFiles/importCodingData", {
      layout: "main",
      success,
      errors,
      errorFilePath,
    });
  } catch (error) {
    next(error);
  }
};

exports.importCodingData_Save = async (req, res, next) => {
  const validateExcelFileResult = await validateExcelFile(req.file);
  if (validateExcelFileResult) {
    req.flash("errors", validateExcelFileResult.errors);
    const filePath = path.join(__dirname,"../../../uploads",req.file.filename);
    deleteUploadedFile(filePath);

    return res.redirect("/importFiles/importCodingData");
  }

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const fileName = req.file.originalname;
  let errorSheet = null;
  let errorRows = [];

  for (const [index, row] of sheetData.entries()) {
    const validationResult = validationRow(row, index);

    if (validationResult) {
      errorRows.push(validationResult);
    }

    if (errorRows.length > 0) {
      errorSheet = errorRows.map((row) => ({
        Row: row.Row,
        Errors: row.Errors,
        ...row.OriginalData,
      }));
    }
  }

  if (errorSheet) {
    const errorFilePath = createErrorSheet(errorSheet, fileName);

    req.flash("errorFilePath", errorFilePath);

    console.log(errorFilePath);

    const filePath = path.join(
      __dirname,
      "../../../uploads",
      req.file.filename
    );
    deleteUploadedFile(filePath);

    return res.redirect("/importFiles/importCodingData");
  } else {
    console.log("خطا ندارد و باید در دیتابیس ذخیره شود");

    for (const [index, row] of sheetData.entries()) {
      try {
        await CodingDataModel.create({
          CodeTableListId: row.CodeTableListId,
          title: row.title,
          description: row.description,
          sortId: row.sortId,
          refId: row.refId,
          createdAt: row.createdAt ? row.createdAt : Date.now(),
          creator: row.creator,
          updatedAt: null,
        });
      } catch (error) {
        let errors = [];

        if (error.name === "SequelizeValidationError") {
          errors = error.message.split("Validation error:");

          if (errors.length > 0) {
            errorRows.push({
              Row: index + 1,
              Errors: errors.join(", "),
              OriginalData: row,
            });
          }
          if (errorRows.length > 0) {
            errorSheet = errorRows.map((row) => ({
              Row: row.Row,
              Errors: row.Errors,
              ...row.OriginalData,
            }));
          }
        }

        if (error.name === "SequelizeUniqueConstraintError") {
          errors = error.message.split("SequelizeUniqueConstraintError");

          if (errors.length > 0) {
            errorRows.push({
              Row: index + 1,
              Errors: errors.join(", "),
              OriginalData: row,
            });
          }
          if (errorRows.length > 0) {
            errorSheet = errorRows.map((row) => ({
              Row: row.Row,
              Errors: row.Errors,
              ...row.OriginalData,
            }));
          }
        }

        if (error.name === "SequelizeForeignKeyConstraintError") {
          // errors = error.message.split("SequelizeForeignKeyConstraintError");
          errors = 'این کد در جدول کدینگ اصلی وجود ندارد'

          if (errors.length > 0) {
            errorRows.push({
              Row: index + 1,
              Errors: errors,
              OriginalData: row,
            });
          }
          if (errorRows.length > 0) {
            errorSheet = errorRows.map((row) => ({
              Row: row.Row,
              Errors: row.Errors,
              ...row.OriginalData,
            }));
          }
        }

      }

    }

    if (errorSheet) {
      const errorFilePath = createErrorSheet(errorSheet, fileName);
      req.flash("errorFilePath", errorFilePath);
    } else {
      req.flash("success", "اطلاعات با موفقیت در سامانه ذخیره شد.");
    }

    const filePath = path.join(__dirname,"../../../uploads",req.file.filename);
    deleteUploadedFile(filePath);
    return res.redirect("/importFiles/importCodingData");

  }
  
  
};

const validateExcelFile = async (file) => {
  if (!file.mimetype.includes("spreadsheet")) {
    return {
      isValid: false,
      errors: " فرمت فایل می‌بایست اکسل باشد. !فرمت فایل معتبر نیست",
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
    const filePath = path.join(__dirname, "../../../", req.query.filePath);
    const fileName = path.basename(filePath);

    console.log("filePath = ", filePath, " ;fileName = ", fileName);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("خطا در ارسال فایل خطا", err);
        return res.status(500).send("مشکلی در دانلود فایل رخ داده است.");
      }
    });
  } catch (error) {
    next(error);
  }
};

const createErrorSheet = (_errorSheet, _filename) => {
  const errorWorkbook = xlsx.utils.book_new();
  const errorWorksheet = xlsx.utils.json_to_sheet(_errorSheet);
  xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, "Errors");

  const errorFilePath = `uploads/errors/errors_${
    _filename.split(".")[0]
  }_${Date.now()}.xlsx`;
  xlsx.writeFile(errorWorkbook, errorFilePath);
  return errorFilePath;
};

const validationRow = (row, index) => {
  const errors = [];
  if (!row.CodeTableListId) errors.push("کد پدر وارد نشده است");
  if (row.CodeTableListId && isNaN(row.CodeTableListId))
    errors.push("کد پدر باید عدد باشد");
  if (!row.title) errors.push("عنوان وارد نشده است.");
  if (!row.sortId) errors.push("ترتیب وارد نشده است.");
  if (row.sortId && isNaN(row.sortId)) errors.push("ترتیب باید عدد باشد.");
  if (!row.createdAt){
    errors.push('تاریخ ایجاد وارد نشده است')
  }else{
    const dateError = validateDate(row.createdAt)
    if(dateError) errors.push(dateError)    
  } 

  if (errors.length > 0) {
    return {
      Row: index + 1,
      Errors: errors.join(", "),
      OriginalData: row,
    };
  }

  return null;
};


const validateDate = (date)=>{
  const allowedFormats = [
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm:ss.SSS',
    'YYYY-MM-DD HH:mm:ss',
    'DD-MM-YYYY'
  ]

  const isValid = allowedFormats.some((format) =>
    moment(date,format,true).isValid()
  )

  if(!isValid) return 'تاریخ باید در فرمت YYYY-MM-DD , YYYY-MM-DD HH:mm:ss.SSS یا YYYY-MM-DD HH:mm:ss'

  return null
}