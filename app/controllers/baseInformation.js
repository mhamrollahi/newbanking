const baseInfoModel = require("@models/baseInformation");

exports.index = async (req, res, next) => {
  try {
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const result = await baseInfoModel.findAll(page, perPage);

    const totalCodeTableLists = await baseInfoModel.count();
    const totalPages = Math.ceil(totalCodeTableLists / perPage);
    const pagination = {
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      isMoreThan3Pages: totalPages > 3,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    res.render("./baseInformation/index", {
      layout: "main",
      result,
      pagination,
      helper: {
        show3Pages_Index: function (is3pages, option) {
          return is3pages;
        },
      },
    });
    // res.send(result)
  } catch (error) {
    next(error);
  }
};
