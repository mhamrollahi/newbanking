const { CodingDataModel, CodeTableListModel } = require("../../models");
const dateService = require("@services/dateService");

exports.getData = async (req, res, next) => {
  try {
    
    const codeTableListId = req.params.id;
    const result = await CodingDataModel.findAll({
      where: { CodeTableListId: codeTableListId },
      include: {
        model: CodeTableListModel,
        attributes: ["fa_TableName", "en_TableName"],
      },
    });
    
    res.json(result);

  } catch (error) {
    next(error);
  }
};


exports.index = async (req, res, next) => {
  try {

    const codeTableListId = req.params.id;

    const codingDataList = await CodingDataModel.findAll({
      where: { CodeTableListId: codeTableListId },
      include: {
        model: CodeTableListModel,
        attributes: ["fa_TableName", "en_TableName"],
      },
    });

    const codeTableListData = await CodeTableListModel.findAll({
      attributes: ["id", "fa_TableName", "en_TableName"],
      raw: true,
      nest: true,
    });

    const success = req.flash("success");
    const removeSuccess = req.flash("removeSuccess");

    let fa_TableName = "";

    if (codingDataList.length > 0) {
      fa_TableName = codingDataList[0].CodeTableList.fa_TableName;
    } else {
      const result = await CodeTableListModel.findByPk(codeTableListId);
      fa_TableName = result.fa_TableName;
    }

    res.render("./baseInformation/codingData/index", {
      layout: "main",
      helpers:{
        isSelected:function (currentId,options){
          return codeTableListId == currentId ? "selected" : ""
        }
      },
      success,
      removeSuccess,
      fa_TableName,
      codeTableListData,
      codeTableListId,
    });

  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;

    console.log("codeTableListId = ", codeTableListId);

    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = errors.length > 0;
    const { fa_TableName } = await CodeTableListModel.findByPk(
      codeTableListId,
      { attributes: ["fa_TableName"] }
    );

    console.log(fa_TableName);

    res.render("./baseInformation/codingData/create", {
      layout: "main",
      errors,
      hasError,
      success,
      codeTableListId,
      fa_TableName,
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codingData = {
      CodeTableListId: req.params.id,
      title: req.body.title,
      description: req.body.description === "" ? null : req.body.description,
      sortId: req.body.sortId,
      refId: req.body.refId === "" ? null : req.body.refId,
      creator: "MHA",
    };

    console.log(codingData);

    const { id } = await CodingDataModel.create(codingData);

    if (id) {
      req.flash("success", "اطلاعات کدینگ جدید با موفقیت ثبت شد.");
      return res.redirect(`../index/${req.params.id}`);
    }
  } catch (error) {
    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect(`../create/${req.params.id}`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(error.message);

      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect(`../create/${req.params.id}`);
    }

    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = req.flash("errors");
    const hasError = errors.length > 0;
    const success = req.flash("success");
    const removeSuccess = req.flash("removeSuccess");

    const codingDataId = await req.params.id;
    const codingData = await CodingDataModel.findOne({
      where: { id: codingDataId },
      raw: true,
      nest: true,
      include: {
        model: CodeTableListModel,
        attributes: ["id", "fa_TableName", "en_TableName"],
      },
    });

    // const { fa_TableName } = await CodeTableListModel.findByPk(codingData.id, {
    //   attributes: ["fa_TableName"],
    // });

    res.render("./baseInformation/codingData/edit", {
      layout: "main",
      codingData,
      fa_createdAt: dateService.toPersianDate(codingData.createdAt),
      fa_updatedAt: dateService.toPersianDate(codingData.updatedAt),
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
    const codingDataId = await req.params.id;

    const codingData = {
      title: req.body.title,
      description: req.body.description === "" ? null : req.body.description,
      sortId: req.body.sortId,
      refId: req.body.refId === "" ? null : req.body.refId,
      updater: "MHA_Updated",
    };

    const { CodeTableListId } = await CodingDataModel.findByPk(codingDataId);

    console.log(CodeTableListId);

    const rowsAffected = await CodingDataModel.update(
      {
        title: codingData.title,
        description: codingData.description,
        sortId: codingData.sortId,
        refId: codingData.refId,
        updater: codingData.updater,
        CodeTableListId:CodeTableListId,
        updatedAt: new Date().toLocaleDateString("en-US"),
      },
      { where: { id: codingDataId } }
    );

    console.log(rowsAffected, "CodeTableListId = ", req.body.CodeTableListId);

    if (rowsAffected[0] > 0) {
      req.flash("success", "اطلاعات با موفقیت اصلاح شد.");
      return res.redirect(`../index/${CodeTableListId}`);
    }

    req.flash(
      "errors",
      "اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید..."
    );

    return res.redirect(`../edit/${CodeTableListId}`);
  } catch (error) {
    const id = await req.params.id;

    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect(`../edit/${id}`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect(`../edit/${id}`);
    }

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codingDataId = req.params.id;

    const { CodeTableListId } = await CodingDataModel.findByPk(codingDataId);

    const rowsAffected = await CodingDataModel.destroy({
      where: { id: codingDataId },
    });

    console.log(CodeTableListId);

    req.flash("success", "اطلاعات با موفقیت حذف شد.");
    if (rowsAffected > 0) {
      return res.redirect(`../index/${CodeTableListId}`);
    }
  } catch (error) {
    const { CodeTableListId } = await CodingDataModel.findByPk(req.param.id);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      req.flash(
        "removeSuccess",
        "این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!"
      );
      return res.redirect(`../index/${CodeTableListId}`);
    }

    next(error);
  }
};
