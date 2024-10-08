const codingDataModel = require('@models/baseInformation/codingData')
const codeTableListModel = require('@models/baseInformation/codeTableList')
const codingDataValidators = require('@validators/baseInformation/codingData')


exports.index = async(req,res,next)=>{
  try {
    
    const codeTableListId = req.params.id
    const page = 'page' in req.query ? parseInt(req.query.page) : 1 
    const perPage = 10
    const totalCodingData = await codingDataModel.count(codeTableListId)
    const codingDataList = await codingDataModel.findAll(codeTableListId,page,perPage)
    const totalPages = Math.ceil(totalCodingData / perPage)
    const codeTableListData = await codeTableListModel.findAll(page,1000)

    const success = req.flash('success')
    let fa_TableName = ''
    
    if(codingDataList.length > 0) {
      fa_TableName = codingDataList[0].fa_TableName
    }else{
      const result = await codeTableListModel.find(codeTableListId)
      fa_TableName = result.fa_TableName
    }


    let offset;
    let to;
    
    offset = (page - 1) * perPage;
    to = offset + perPage;

    const pagination = {
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      isMoreThan3Pages: totalPages > 3,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalCount: totalCodingData,
      offset: offset == 0 ? 1 : offset + 1,
      to: page == totalPages ? totalCodingData : to,
    };

    res.render("./baseInformation/codingData/index",{
      layout:'main',
      codingDataList,
      pagination,
      helpers: {
        showDisabled: function (isDisabled, options) {
          return !isDisabled ? "disabled" : "";
        },
        isSelected : function (currentId,options){
          return codeTableListId == currentId ? "selected" : ""
        },
      },

      success,
      fa_TableName,
      codeTableListData,
      
    })
  } catch (error) {
      next(error)
  }
}

exports.create = async(req,res,next) => {
  try {
    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = errors.length > 0;
    // console.log('errors = ',errors)

    res.render("./baseInformation/codingData/create", {
      layout: "main",
      errors,
      hasError,
      success,
    });
  } catch (error) {
      next(error)
  }
}

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codingData = {
      codeTableListId: req.body.codeTableListId,
      title: req.body.title,
      description: req.body.fa_TableName,
      sortId: req.body.en_TableName,
      refId: req.body.en_TableName,
      creator: "MHA",
    };

    let errors = [];
    errors = codingDataValidators.createValidation(codingData);

    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    errors = await codingDataValidators.checkUnique_CodeTableListId_Title(codeTableListData.en_TableName
    );
    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    const rowsAffected = await codeTableListModel.create(codeTableListData);

    if(rowsAffected>0){
      console.log(rowsAffected)

      req.flash('success','اطلاعات کدینگ جدید با موفقیت ثبت شد.')
      return res.redirect('./index')
    }
  } catch (error) {
    next(error);
  }
};
