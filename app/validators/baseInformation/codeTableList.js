const codeTableListModel = require('@models/baseInformation/codeTableList')

exports.createValidation = (request) =>{
  const errors = []

  if(request.code === ''){
    errors.push('کد نمی‌تواند خالی باشد.')
  }
  
  if(request.fa_TableName === ''){
    errors.push('نام فارسی جدول نمی‌تواند خالی باشد.')
  }
  
  if(request.en_TableName === ''){
    errors.push('نام انگلیسی جدول نمی‌تواند خالی باشد.')
  }
  
  return errors
}

exports.checkUniqueEN_TableName = async (en_TableName)=>{
  const errors = []
  const result = await codeTableListModel.findBy_EN_TableName(en_TableName)
  
  if(result[0]>0){
    errors.push('این نام انگلیسی وجود دارد، لطفا نام دیگری را انتخاب کنید !!!')
  }
  return errors
}

exports.checkUniqueFA_TableName = async (fa_TableName)=>{
  const errors = []
  const result = await codeTableListModel.findBy_FA_TableName(fa_TableName)
  if(result[0]>0){
    errors.push('این نام فارسی وجود دارد، لطفا نام دیگری را انتخاب کنید !!!')
  }
  return errors
}