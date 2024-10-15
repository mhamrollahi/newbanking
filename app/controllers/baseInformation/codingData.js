const { CodingDataModel, CodeTableListModel } = require("../../models");
const dateService = require("@services/dateService");

exports.index = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;
    const page = "page" in req.query ? parseInt(req.query.page) : 1;
    const perPage = 10;
    const totalCodingData = await CodingDataModel.count({
      where: { id: codeTableListId },
    });

    const codingDataList = await CodingDataModel.findAll({
      where: { CodeTableListId: codeTableListId },
      limit: perPage,
      offset: Math.max(0, (page - 1) * perPage),
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
      include: {
        model: CodeTableListModel,
        attributes: ["fa_TableName", "en_TableName"],
      },
    });

    // console.log(codingDataList[0].CodeTableList.fa_TableName);
    // console.log(codingDataList[0].CodeTableList.en_TableName);

    const codingDataListPresent = codingDataList.map((data) => {
      data.fa_createdAt = dateService.toPersianDate(
        data.createdAt,
        "YYYY/MM/DD"
      );
      return data;
    });

    const totalPages = Math.ceil(totalCodingData / perPage);
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

    req.flash("tableName", fa_TableName);

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

    res.render("./baseInformation/codingData/index", {
      layout: "main",
      codingDataList: codingDataListPresent,
      pagination,
      helpers: {
        showDisabled: function (isDisabled, options) {
          return !isDisabled ? "disabled" : "";
        },
        isSelected: function (currentId, options) {
          return codeTableListId == currentId ? "selected" : "";
        },
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
      {
        attributes: ["fa_TableName"],
      }
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

    console.log("new id = ", id);

    if (id) {
      req.flash("success", "اطلاعات کدینگ جدید با موفقیت ثبت شد.");
      return res.redirect(`../index/${req.params.id}`);
    }
  } catch (error) {
    let errors = [];

    console.log("error ... ", error);

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
