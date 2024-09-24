const codeTableListModel = require("@models/baseInformation/codeTableList.js");
const codeTableListValidators = require("@validators/baseInformation/codeTableList");

exports.index = async (req, res, next) => {
  try {
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const codeTableList = await codeTableListModel.findAll(page, perPage);
    const totalCodeTableLists = await codeTableListModel.count();
    const totalPages = Math.ceil(totalCodeTableLists / perPage);
    let offset;
    const success = req.flash("success");

    offset = (page - 1) * perPage;
    let to;
    to = offset + perPage;

    const pagination = {
      page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : totalPages,
      prevPage: page > 1 ? page - 1 : 1,
      isMoreThan3Pages: totalPages > 3,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalCount: totalCodeTableLists,
      offset: offset == 0 ? 1 : offset + 1,
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
      success,
    });
    // res.send(result)
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = errors.length > 0;
    // console.log('errors = ',errors)

    res.render("./baseInformation/codeTableList/create", {
      layout: "main",
      errors,
      hasError,
      success,
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codeTableListData = {
      code: req.body.code,
      fa_TableName: req.body.fa_TableName,
      en_TableName: req.body.en_TableName,
      creator: "MHA",
    };

    let errors = [];
    errors = codeTableListValidators.createValidation(codeTableListData);

    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    errors = await codeTableListValidators.checkUniqueEN_TableName(
      codeTableListData.en_TableName
    );
    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    errors = await codeTableListValidators.checkUniqueFA_TableName(
      codeTableListData.fa_TableName
    );
    if (errors.length > 0) {
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    const rowsAffected = await codeTableListModel.create(codeTableListData);

    if (rowsAffected[0] > 0) {
      console.log(rowsAffected);

      req.flash("success", "اطلاعات کدینگ جدید با موفقیت ثبت شد.");
      res.redirect("./index");
    }
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const hasError = errors.length > 0;
    const success = req.flash("success");

    const codeTableListId = await req.params.id;
    const codeTableList = await codeTableListModel.find(codeTableListId);

    res.render("./baseInformation/codeTableList/edit", {
      layout: "main",
      codeTableList,
      errors,
      hasError,
      success,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;
    const rowsAffected = await codeTableListModel.delete(codeTableListId);
    console.log(rowsAffected);

    req.flash("success", "اطلاعات با موفقیت حذف شد.");
    if (rowsAffected > 0) {
      return res.redirect("../index");
    }
  } catch (error) {
    next(error);
  }
};
