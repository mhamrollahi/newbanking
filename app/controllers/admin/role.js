const dateService = require('@services/dateService');
const { models } = require('@models/');
const { RoleModel, UserViewModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

exports.getData = async (req, res, next) => {
  try {
    const result = await RoleModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
      ]
    });
    console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {

    res.adminRender('./admin/role/index', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست نقش‌های کاربران',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {

    res.adminRender('./admin/role/create', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست نقش‌های کاربران',
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

    const roleData = {
      name: req.body.name,
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

    const { id } = await RoleModel.create(roleData); 

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
    const roleId = req.params.id;

    const roleData = await RoleModel.findOne({
      where: { id: roleId },
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

    if (roleData) {
      roleData.fa_createdAt = dateService.toPersianDate(roleData.createdAt);
      roleData.fa_updatedAt = dateService.toPersianDate(roleData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./admin/role/edit', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'اصلاح کاربر',
      roleData,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const roleId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${roleId}`);
    }

    const rowsAffected = await RoleModel.update(
      {
        name: req.body.name,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0,
      },
      { where: { id: roleId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${roleId}`);
  } catch (error) {

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const rowsAffected = await RoleModel.destroy({
      where: { id: roleId }
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
  const roleData = {
    name: req.body.name
  };

  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(200)
      .required()
      .label('نام نقش')
      .pattern(/^[\p{L}\s]+$/u) // فقط حروف فارسی و انگلیسی (و فاصله مجاز)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.max': errMessages['string.max'],
        'string.required': errMessages['any.required'],
        'string.pattern.base': '{#label} باید فقط شامل حروف فارسی یا انگلیسی باشد'
      }),


  });

  return schema.validate(roleData, { abortEarly: false });
};
