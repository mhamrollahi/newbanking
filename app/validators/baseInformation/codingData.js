const codingDataModel = require("@models/baseInformation/codingData");

exports.createValidation = (request) => {
  const errors = [];

  if (request.title === "") {
    errors.push("عنوان نمی‌تواند خالی باشد.");
  }

  if (request.sortId === "") {
    errors.push("رتبه کدینگ نمی‌تواند خالی باشد.");
  }

  return errors;
};

exports.checkUnique_CodeTableListId_Title = async (codeTableListId,title,isUpdateMode = false) => {
  const errors = [];
  const result = await codingDataModel.findCodeTableListId_Title(codeTableListId,title);

  if (isUpdateMode) {
    console.log("in en_TableName = ", result[0]);
    if (result[0] >= 2) {
      errors.push("این کدینگ در جدول وجود دارد، لطفا نام دیگری را انتخاب کنید !!!");
    }
    return errors;
  }

  if (result[0] > 0) {
    errors.push("این کدینگ در جدول وجود دارد، لطفا نام دیگری را انتخاب کنید !!!");
  }

  return errors;
};
