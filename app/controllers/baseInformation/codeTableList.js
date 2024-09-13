const codeTableListModel = require("@models/baseInformation/codeTableList.js");

exports.index = async (req, res, next) => {
  try {

    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const codeTableList = await codeTableListModel.findAll(page, perPage);
    let offset 
    const totalCodeTableLists = await codeTableListModel.count();
    const totalPages = Math.ceil(totalCodeTableLists / perPage);
    offset = ((page -1) * perPage)  
    let to 
    to = offset + perPage

    const pagination = {
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      isMoreThan3Pages: totalPages > 3,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalCount: totalCodeTableLists,
      offset: offset == 0 ? 1 : offset+1,
      to: page == totalPages ? totalCodeTableLists : to,
    };

    res.render("./baseInformation/codeTableList/index", {
      layout: "main",
      codeTableList,
      pagination,
      helpers: {
        showDisabled: function (isDisabled, options) {
          return !isDisabled ? "disabled" : "";
        },
      },
    });
    // res.send(result)
  } catch (error) {
    next(error);
  }
};

exports.create = async(req,res,next)=>{
  try {
      res.render('./baseInformation/codeTableList/create',{layout:'main'})    
  } catch (error) {
      next(error)
  }
}