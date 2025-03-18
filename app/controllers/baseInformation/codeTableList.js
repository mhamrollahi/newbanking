const dateService = require('@services/dateService');
const { models } = require('@models');
const { CodeTableListModel, UserViewModel } = models;

exports.getData = async (req, res, next) => {
  try {
    const result = await CodeTableListModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        }
      ]
    });

    console.log(
      'result: ',
      result.map((item) => item.creator.fullName)
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.test = async (req, res, next) => {
  try {
    res.render('./baseInformation/codeTableList/test', { layout: '' });
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const success = req.flash('success');
    const removeSuccess = req.flash('removeSuccess');

    res.render('./baseInformation/codeTableList/index', {
      layout: 'main',
      success,
      removeSuccess
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = req.flash('errors');
    const success = req.flash('success');
    const hasError = errors.length > 0;

    res.render('./baseInformation/codeTableList/create', {
      layout: 'main',
      errors,
      hasError,
      success
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    // res.send(req.body)
    const codeTableListData = {
      fa_TableName: req.body.fa_TableName,
      en_TableName: req.body.en_TableName,
      creatorId: req.session?.user?.id ?? 0
    };

    const { id } = await CodeTableListModel.create(codeTableListData);
    console.log('id', id);

    if (id) {
      req.flash('success', 'اطلاعات کدینگ جدید با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    // let errors = [];

    // if (error.name === "SequelizeValidationError") {
    //   errors = error.message.split("Validation error:");
    //   req.flash("errors", errors);
    //   return res.redirect("./create");
    // }

    // if (error.name === "SequelizeUniqueConstraintError") {
    //   errors = error.message.split("SequelizeUniqueConstraintError");
    //   req.flash("errors", errors);
    //   return res.redirect("./create");
    // }

    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const errors = req.flash('errors');
    const hasError = errors.length > 0;
    const success = req.flash('success');
    const removeSuccess = req.flash('removeSuccess');

    const codeTableListId = await req.params.id;
    const codeTableList = await CodeTableListModel.findOne({
      where: { id: codeTableListId },
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
        }
      ],
      raw: true,
      nest: true
    });

    res.render('./baseInformation/codeTableList/edit', {
      layout: 'main',
      codeTableList,
      fa_createdAt: dateService.toPersianDate(codeTableList.createdAt),
      fa_updatedAt: dateService.toPersianDate(codeTableList.updatedAt),
      errors,
      hasError,
      success,
      removeSuccess
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const codeTableListId = await req.params.id;

    const codeTableListData = {
      en_TableName: req.body.en_TableName,
      fa_TableName: req.body.fa_TableName,
      updated_at: new Date().toLocaleDateString('en-US'),
      updaterId: req.session?.user?.id ?? 0
    };

    const rowsAffected = await CodeTableListModel.update(
      {
        en_TableName: codeTableListData.en_TableName,
        fa_TableName: codeTableListData.fa_TableName,
        updatedAt: codeTableListData.updated_at,
        updaterId: codeTableListData.updaterId
      },
      { where: { id: codeTableListId } }
    );

    console.log(req.params);

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect('../index');
    }

    req.flash('suuccess', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');
    return res.redirect('../index');
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codeTableListId = req.params.id;
    const rowsAffected = await CodeTableListModel.destroy({
      where: { id: codeTableListId }
    });

    req.flash('success', 'اطلاعات با موفقیت حذف شد.');
    if (rowsAffected > 0) {
      return res.redirect('../index');
    }
  } catch (error) {
    next(error);
  }
};
