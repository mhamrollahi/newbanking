const xlsx = require("xlsx");
const { CodingDataModel } = require("../../models");
const path = require('path')
const fs = require("fs");

exports.importCodingData = (req, res, next) => {
  try {
    const success = req.flash("success");
    const errors = req.flash("errors");
    const errorFilePath= req.flash('errorFilePath')

   console.log('errorFilePath = ',errorFilePath);

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
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const errorRows = [];

    for (const [index, row] of sheetData.entries()) {
      const errors = [];
      if (!row.CodeTableListId) errors.push("کد پدر وارد نشده است");
      if (row.CodeTableListId && isNaN(row.CodeTableListId))
        errors.push("کد پدر باید عدد باشد");
      if (!row.title) errors.push("عنوان وارد نشده است.");
      if (!row.sortId) errors.push("ترتیب وارد نشده است.");
      if (row.sortId && isNaN(row.sortId)) errors.push("ترتیب باید عدد باشد.");

      if (errors.length > 0) {
        errorRows.push({
          Row: index + 2,
          Errors: errors.join(", "),
          OriginalData: row,
        });

      } else 
      {
        console.log('inside of insert .... ')
        
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
      }
    }

    if (errorRows.length > 0) {
      const errorSheet = errorRows.map((row) => ({
        Row: row.Row,
        Errors: row.Errors,
        ...row.OriginalData,
      }));

      const errorWorkbook = xlsx.utils.book_new();
      const errorWorksheet = xlsx.utils.json_to_sheet(errorSheet);
      xlsx.utils.book_append_sheet(errorWorkbook, errorWorksheet, "Errors");

      const errorFilePath = `uploads/errors/errors_${Date.now()}.xlsx`;
      xlsx.writeFile(errorWorkbook, errorFilePath);

      req.flash('errors','برخی از ردیف‌ها خطا داشتند لطفا فایل خطا را مشاهد نمایید.')
      req.flash('errorFilePath',errorFilePath)

      console.log(errorFilePath)

      return res.redirect("/importFiles/importCodingData")
    
    }

    const filePath = path.join(__dirname,'../../../uploads',req.file.filename)
    deleteUploadedFile(filePath)

    req.flash("success", "فایل کدینگ با موفقیت بارگذاری شد");
    return res.redirect("/importFiles/importCodingData");

  } catch (error) {

    let errors = [];

    const filePath = path.join(__dirname,'../../../uploads',req.file.filename)
    deleteUploadedFile(filePath)

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      
      console.log('error = ', error)
      console.log('errors = ', errors)

      req.flash("errors", error.message);
      return res.redirect(`/importFiles/importCodingData`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");

      console.log('error = ', error)
      console.log('errors = ', errors)

      req.flash("errors", errors);
      return res.redirect(`/importFiles/importCodingData`);
    }

    next(error);
  }
};

const deleteUploadedFile = async (filePath) => {

  await fs.unlinkSync(filePath)
  console.log(`فایل ${filePath} با موفقیت حدف شد.....`)
}


exports.downloadErrorFile = async(req,res,next)=>{
  try {
    const filePath = path.join(__dirname,'../../../uploads/errors',req.query.filePath)
    const fileName = path.basename(filePath)

    res.download(filePath,fileName,(err)=>{
      if(err){
        console.error('خطا در ارسال فایل خطا',err)
        return res.status(500).send('مشکلی در دانلود فایل رخ داده است.')
      }
    })
  } catch (error) {
    next(error)
  }
}