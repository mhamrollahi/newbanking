// const { CodingDataModel, CodeTableListModel } = require("../../models");
const { models } = require('../../models');
const { CodingDataModel, CodeTableListModel, UserViewModel } = models;
const dateService = require('@services/dateService');

exports.getData = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;

    const result = await CodingDataModel.findAll({
      where: { codeTableListId: codeTableListId },
      include: [
        {
          model: CodeTableListModel,
          attributes: ['fa_TableName', 'en_TableName']
        },
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
      ]
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
      where: { codeTableListId: codeTableListId },
      include: {
        model: CodeTableListModel,
        attributes: ['fa_TableName', 'en_TableName']
      }
    });

    const codeTableListData = await CodeTableListModel.findAll({
      attributes: ['id', 'fa_TableName', 'en_TableName'],
      raw: true,
      nest: true
    });

    let fa_TableName = '';

    if (codingDataList.length > 0) {
      fa_TableName = codingDataList[0].CodeTableList.fa_TableName;
    } else {
      const result = await CodeTableListModel.findByPk(codeTableListId);
      fa_TableName = result.fa_TableName;
    }

    res.adminRender('./baseInformation/codingData/index', {
      helpers: {
        isSelected: function (currentId, options) {
          return codeTableListId == currentId ? 'selected' : '';
        }
      },
      // success,
      // removeSuccess,
      fa_TableName,
      codeTableListData,
      codeTableListId
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;

    console.log('codeTableListId = ', codeTableListId);

    // const errors = req.flash('errors');
    // const success = req.flash('success');
    // const hasError = errors.length > 0;
    const { fa_TableName } = await CodeTableListModel.findByPk(codeTableListId, { attributes: ['fa_TableName'] });

    console.log(fa_TableName);

    res.adminRender('./baseInformation/codingData/create', {
      codeTableListId,
      fa_TableName
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codingData = {
      codeTableListId: req.params.id,
      title: req.body.title,
      description: req.body.description === '' ? null : req.body.description,
      sortId: req.body.sortId,
      refId: req.body.refId === '' ? null : req.body.refId,
      creatorId: req.session?.user?.id ?? 0
    };

    console.log('before create codingData = ', codingData);

    const { id } = await CodingDataModel.create(codingData);

    console.log('after create codingData = ', id);

    if (id) {
      req.flash('success', 'اطلاعات کدینگ جدید با موفقیت ثبت شد.');
      return res.redirect(`../index/${req.params.id}`);
    }
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    // const errors = req.flash('errors');
    // const hasError = errors.length > 0;
    // const success = req.flash('success');
    // const removeSuccess = req.flash('removeSuccess');

    const codingDataId = await req.params.id;
    const codingData = await CodingDataModel.findOne({
      where: { id: codingDataId },
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['fullName']
        },
        {
          model: UserViewModel,
          as: 'updater',
          attributes: ['fullName']
        },
        { 
          model: CodeTableListModel, 
          attributes: ['id', 'fa_TableName', 'en_TableName'] 
        }
      ],

      raw: true,
      nest: true,
     
    });

    if (codingData) {
      codingData.fa_createdAt = dateService.toPersianDate(codingData.createdAt);
      codingData.fa_updatedAt = dateService.toPersianDate(codingData.updatedAt);
    }

    console.log('codingData = ', codingData, codingData.codeTableListId);

    // const { fa_TableName } = await CodeTableListModel.findByPk(codingData.id, {
    //   attributes: ["fa_TableName"],
    // });

    res.adminRender('./baseInformation/codingData/edit', {
      // layout: 'main',
      codingData,
      // fa_createdAt: dateService.toPersianDate(codingData.createdAt),
      // fa_updatedAt: dateService.toPersianDate(codingData.updatedAt),
      // // errors,
      // // hasError,
      // success,
      // removeSuccess
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
      description: req.body.description === '' ? null : req.body.description,
      sortId: req.body.sortId,
      refId: req.body.refId === '' ? null : req.body.refId,
      updaterId: req.session?.user?.id ?? 0
    };

    const { codeTableListId } = await CodingDataModel.findByPk(codingDataId);

    console.log(codeTableListId);

    const rowsAffected = await CodingDataModel.update(
      {
        title: codingData.title,
        description: codingData.description,
        sortId: codingData.sortId,
        refId: codingData.refId,
        updaterId: codingData.updaterId,
        codeTableListId: codeTableListId,
        updatedAt: new Date().toLocaleDateString('en-US')
      },
      { where: { id: codingDataId } }
    );

    console.log(rowsAffected, 'codeTableListId = ', req.body.codeTableListId);

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index/${codeTableListId}`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${codeTableListId}`);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codingDataId = req.params.id;

    const { codeTableListId } = await CodingDataModel.findByPk(codingDataId);

    const rowsAffected = await CodingDataModel.destroy({
      where: { id: codingDataId }
    });

    console.log(codeTableListId);

    req.flash('success', 'اطلاعات با موفقیت حذف شد.');
    if (rowsAffected > 0) {
      return res.redirect(`../index/${codeTableListId}`);
    }
  } catch (error) {
    // const { codeTableListId } = await CodingDataModel.findByPk(req.param.id);

    // if (error.name === 'SequelizeForeignKeyConstraintError') {
    //   req.flash('removeSuccess', 'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
    //   return res.redirect(`../index/${codeTableListId}`);
    // }

    next(error);
  }
};
