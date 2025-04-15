const dateService = require('@services/dateService');
const { models, sequelize } = require('@models/');
const { PermissionModel, UserViewModel,CodingDataModel,CodeTableListModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');
const coding = require('@constants/codingDataTables.js');

exports.getData = async (req, res, next) => {
  try {
    const result = await PermissionModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model:CodingDataModel,
         as:'action',
         attributes:['title']
        }
      ]
    });
    // console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {

    res.adminRender('./admin/permission/index', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست مجوز‌های سیستم',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const actionListData = await CodingDataModel.findAll({ 
      attributes:['id','title'],
      include: [{
        model: CodeTableListModel,
        where: {en_TableName: coding.CODING_Action_Permission}
      }],
      raw: true,
      nest: true
    })
    
    const allTablesList = await getAllTables()

    console.log('allTablesList = ', allTablesList);

      
    res.adminRender('./admin/permission/create', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست مجوز‌های سیستم',
      actionListData,
      allTablesList,
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    let userId = 'null';
    if (req.session && req.session.user) {
      userId = req.session?.user?.id ?? 0;
    }

    const permissionData = {
      name: req.body.name.toLowerCase(),
      entity_type: req.body.entity_type,
      actionId: req.body.actionId,
      description: req.body.description,
      creatorId: userId
    };

    //اعتبار سنجی فرم ورودی - Start

    const { error } = formValidation(req);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect('./create');
    }

    //اعتبار سنجی فرم ورودی - End

    const { id } = await PermissionModel.create(permissionData); 

    if (id) {
      req.flash('success', 'اطلاعات کاربر با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const permissionId = req.params.id;

    const permissionData = await PermissionModel.findOne({
      where: { id: permissionId },
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

    if (permissionData) {
      permissionData.fa_createdAt = dateService.toPersianDate(permissionData.createdAt);
      permissionData.fa_updatedAt = dateService.toPersianDate(permissionData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./admin/permission/edit', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست مجوز‌های سیستم',
      permissionData,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const permissionId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${permissionId}`);
    }

    const rowsAffected = await PermissionModel.update(
      {
        name: req.body.name,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0,
      },
      { where: { id: permissionId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${permissionId}`);
  } catch (error) {

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const permissionId = req.params.id;
    const rowsAffected = await PermissionModel.destroy({
      where: { id: permissionId }
    });

    if (rowsAffected > 0) {
      req.flash('success', 'اطلاعات با موفقیت حذف شد.');
      return res.redirect('../index');
    }
  } catch (error) {

    next(error);
  }
};

const formValidation = (req) => {
  const permissionData = {
    name: req.body.name
  };

  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(200)
      .required()
      .label('نام مجوز')
      // .pattern(new RegExp("^[\\p{L}\\s\\-\\u200C\\u200D\\(\\)ـ]+$", "u")) // فقط حروف فارسی و انگلیسی (و فاصله مجاز)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.max': errMessages['string.max'],
        'string.required': errMessages['any.required'],
        // 'string.pattern.base': '{#label} باید فقط شامل حروف فارسی یا انگلیسی باشد'
      }),


  });

  return schema.validate(permissionData, { abortEarly: false });
};

const getAllTables = async () => {
  const [tables] = await sequelize.query('SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();')
  return tables.map((t) => ({ name: t.TABLE_NAME}));
}
