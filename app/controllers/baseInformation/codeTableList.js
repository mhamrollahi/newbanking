const { models } = require('@models');
const { CodeTableListModel, UserViewModel } = models;
const dateService = require('@services/dateService');

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


exports.index = async (req, res, next) => {
  try {

    res.adminRender('./baseInformation/codeTableList/index', {});

  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
  
    res.adminRender('./baseInformation/codeTableList/create', {});
  
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
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

    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {

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
      nest: true,
    });

    if (codeTableList) {
      codeTableList.fa_createdAt = dateService.toPersianDate(codeTableList.createdAt);
      codeTableList.fa_updatedAt = dateService.toPersianDate(codeTableList.updatedAt);
    }

    res.adminRender('./baseInformation/codeTableList/edit', {
      codeTableList,
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
