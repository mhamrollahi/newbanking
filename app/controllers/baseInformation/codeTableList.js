const dateService = require("@services/dateService");
const { CodeTableListModel } = require("../../models");

exports.test1 = async (req, res, next) => {
  try {
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const result = await CodeTableListModel.findAll({
      limit: perPage,
      offset: Math.max(0, (page - 1) * perPage),
    });
    const count = await CodeTableListModel.count();
    console.log(result);
    console.log(count);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    let order = []

    const {sort,desc} = req.query


    if(sort){
      order.push([sort,desc === 'true' ? 'DESC' : 'ASC'])
    }else{
      order=[]
      order.push(['id','DESC'])
    }

    const codeTableList = await CodeTableListModel.findAll({
      limit: perPage,
      offset: Math.max(0, (page - 1) * perPage),
      order: order,
      raw: true,
      nest: true,
    });

    const totalCodeTableLists = await CodeTableListModel.count();

    const codeTableListPresent = codeTableList.map((data) => {
      data.fa_createdAt = dateService.toPersianDate(data.createdAt,"YYYY/MM/DD");
      return data;
    });

    const totalPages = Math.ceil(totalCodeTableLists / perPage);
    const success = req.flash("success");
    const removeSuccess = req.flash('removeSuccess')

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
      totalCount: totalCodeTableLists,
      offset: offset == 0 ? 1 : offset + 1,
      to: page == totalPages ? totalCodeTableLists : to,
    };

    res.render("./baseInformation/codeTableList/index", {
      layout: "main",
      codeTableList: codeTableListPresent,
      pagination,
      helpers: {
        showDisabled: function (isDisabled, options) {
          return !isDisabled ? "disabled" : "";
        },
      },
      success,
      removeSuccess,
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

    const { id } = await CodeTableListModel.create(codeTableListData);
    console.log("id", id);

    if (id) {
      req.flash("success", "اطلاعات کدینگ جدید با موفقیت ثبت شد.");
      return res.redirect("./index");
    }

  } catch (error) {

    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect("./create");
    }

    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const hasError = errors.length > 0;
    const success = req.flash("success");
    const removeSuccess = req.flash('removeSuccess')

    const codeTableListId = await req.params.id;
    const codeTableList = await CodeTableListModel.findOne({
      where: { id: codeTableListId },
      raw: true,
      nest: true,
    });

    res.render("./baseInformation/codeTableList/edit", {
      layout: "main",
      codeTableList,
      fa_createdAt: dateService.toPersianDate(codeTableList.createdAt),
      fa_updatedAt: dateService.toPersianDate(codeTableList.updatedAt),
      errors,
      hasError,
      success,
      removeSuccess,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const codeTableListId = await req.params.id;

    const codeTableListData = {
      code: req.body.code,
      en_TableName: req.body.en_TableName,
      fa_TableName: req.body.fa_TableName,
      updated_at: new Date().toLocaleDateString("en-US"),
      updater: "MHA_Updated",
    };

    const rowsAffected = await CodeTableListModel.update(
      {
        code: codeTableListData.code,
        en_TableName: codeTableListData.en_TableName,
        fa_TableName: codeTableListData.fa_TableName,
        updatedAt: codeTableListData.updated_at,
        updater: codeTableListData.updater,
      },
      { where: { id: codeTableListId } }
    );

    console.log(req.params);

    if (rowsAffected[0] > 0) {
      req.flash("success", "اطلاعات با موفقیت اصلاح شد.");
      return res.redirect("../index");
    }

    req.flash("suuccess","اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...");
    return res.redirect('../index')

  } catch (error) {
    
    const codeTableListId = await req.params.id;

    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect(`../edit/${codeTableListId}`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect(`../edit/${codeTableListId}`);
    }

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;
    const rowsAffected = await CodeTableListModel.destroy({
      where: { id: codeTableListId },
    });

    req.flash("success", "اطلاعات با موفقیت حذف شد.");
    if (rowsAffected > 0) {
      return res.redirect("../index");
    }
  } catch (error) {
    
    if (error.name === "SequelizeForeignKeyConstraintError") {
      req.flash("removeSuccess",'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
      return res.redirect(`../index`);
    }

    next(error);
  }

};
