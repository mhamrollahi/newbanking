const codingDataModel = require('@models/baseInformation/codingData')
const codeTableListModel = require('@models/baseInformation/codeTableList')

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