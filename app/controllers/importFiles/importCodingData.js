
const xlsx = require('xlsx')
const {CodingDataModel} = require('../../models')

exports.importCodingData = (req,res,next)=>{
  try {
    res.render('./importFiles/importCodingData',{layout:'main'})
  } catch (error) {
      next(error)
  }
}

exports.importCodingData_Save =async (req,res,next)=>{
  try {

    const workbook = xlsx.readFile(req.file.path)
    const sheetName = workbook.SheetNames[0]
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

    const errorRows = []

    for(const [index,row] of sheetData.entries()){
      const errors = []
      if(!row.CodeTableListId) errors.push('کد پدر وارد نشده است')
      if(row.CodeTableListId && isNaN(row.CodeTableListId)) errors.push('کد پدر باید عدد باشد')
      if(!row.title) errors.push('عنوان وارد نشده است.')
      if(!row.sortId) errors.push('ترتیب وارد نشده است.')
      if(row.sortId && isNaN(row.sortId)) errors.push('ترتیب باید عدد باشد.')
      
      if(errors.length > 0) {
        errorRows.push({
          Row: index + 2,
          Errors: errors.join(', '),
          OriginalData: row,
        })
      }else{
        await CodingDataModel.create({
          CodeTableListId : row.CodeTableListId,
          title: row.title,
          description : row.description,
          sortId: row.sortId,
          refId : row.refId,
          createdAt: row.createdAt,
          creator:row.creator,
        })
      }
    }
    if(errorRows.length>0){
      const errorSheet = errorRows.map(row=>({
        Row:row.Row,
        Errors:row.Errors,
        ...row.OriginalData,
      }))
    

    const errorWorkbook = xlsx.utils.book_new()
    const errorWorksheet = xlsx.utils.json_to_sheet(errorSheet)
    xlsx.utils.book_append_sheet(errorWorkbook,errorWorksheet,'Errors')
    
    const errorFilePath = `uploads/errors-${Date.now()}.xlsx`
    xlsx.writeFile(errorWorkbook,errorFilePath)

    return res.status(400).json({
      message:'برخی از ردیف‌ها خطا داشتند',
      errorFile:errorFilePath,
    })

  }
    res.send('فایل با موفقیت بارگذاری شد.')
  } catch (error) {
    next(error)
  }
}