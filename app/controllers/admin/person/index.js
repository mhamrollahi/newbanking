const dateService = require('@services/dateService');
const { PersonModel } = require('@models/');
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

exports.getData = async (req, res, next) => {
  try {
    const result = await PersonModel.findAll({});
    console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    const success = req.flash('success');
    const removeSuccess = req.flash('removeSuccess');

    res.render('./admin/person/index', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست پروفایل کاربران',
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

    res.render('./admin/person/create', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'تعریف پرفایل جدید',
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
    let userId = 'null'
    if(req.session && req.session.user){
      userId = req.session.user.id
    }

    const personData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationalCode: req.body.nationalCode,
      mobile: req.body.mobile,
      Description: req.body.Description,
      creator:userId
    };
    console.log(personData);

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

    const { id } = await PersonModel.create(personData);

    if (id) {
      req.flash('success', 'اطلاعات کاربر با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    let errors = [];

    if (error.name === 'SequelizeValidationError') {
      errors = error.message.split('Validation error:');
      req.flash('errors', errors);
      return res.redirect(`./create`);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log(error.message);

      errors = error.message.split('SequelizeUniqueConstraintError');
      req.flash('errors', errors);
      return res.redirect(`./create`);
    }
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const personId = req.params.id;

    const errors = req.flash('errors');
    const hasError = errors.length > 0;
    const success = req.flash('success');
    const removeSuccess = req.flash('removeSuccess');
    const personData = await PersonModel.findOne({
      where: { id: personId },
      raw: true,
      nest: false
    });

    res.render('./admin/person/edit', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'اصلاح کاربر',
      personData: personData,
      fa_createdAt: dateService.toPersianDate(personData.createdAt),
      fa_updatedAt: dateService.toPersianDate(personData.updatedAt),
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
    const personId = req.params.id;
    let userId = 'null'
    if(req.session && req.session.user){
      userId = req.session.user.id
    }
    
    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${personId}`);
    }

    const rowsAffected = await PersonModel.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationalCode: req.body.nationalCode,
        mobile: req.body.mobile,
        Description: req.body.Description,
        updater: userId,
      },
      { where: { id: personId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${personId}`);
  } catch (error) {
    const id = await req.params.id;

    let errors = [];

    if (error.name === 'SequelizeValidationError') {
      errors = error.message.split('Validation error:');
      req.flash('errors', errors);
      return res.redirect(`../edit/${id}`);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      errors = error.message.split('SequelizeUniqueConstraintError');
      req.flash('errors', errors);
      return res.redirect(`../edit/${id}`);
    }

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const personId = req.params.id;
    const rowsAffected = await PersonModel.destroy({
      where: { id: personId }
    });

    if (rowsAffected > 0) {
      req.flash('success', 'اطلاعات با موفقیت حذف شد.');
      return res.redirect('../index');
    }
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      req.flash('removeSuccess', 'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
      return res.redirect(`../index`);
    }

    next(error);
  }
};

const formValidation = (req) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationalCode: req.body.nationalCode,
    mobile: req.body.mobile
  };

  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label('نام')
      .pattern(/^[\p{L}\s]+$/u) // فقط حروف فارسی و انگلیسی (و فاصله مجاز)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.max': errMessages['string.max'],
        'string.required': errMessages['any.required'],
        'string.pattern.base': '{#label} باید فقط شامل حروف فارسی یا انگلیسی باشد'
      }),

    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label('نام خانوادگی')
      .pattern(/^[\p{L}\s]+$/u) // فقط حروف فارسی و انگلیسی (و فاصله مجاز)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.max': errMessages['string.max'],
        'string.required': errMessages['any.required'],
        'string.pattern.base': '{#label} باید فقط شامل حروف فارسی یا انگلیسی باشد'
      }),

    nationalCode: Joi.string().min(10).max(10).required().label('کد ملی').pattern(/^\d+$/).messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required'],
      'string.pattern.base': '{#label} می بایست فقط عدد باشد.'
    }),

    mobile: Joi.string()
      .min(11)
      .max(11)
      .label('شماره موبایل')
      .required()
      .pattern(/^09[0-9]{9}$/)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.required': errMessages['any.required'],
        'string.pattern.base': ' فرمت {#label} نادرست می باشد (فرمت درست --------09)'
      })
  });

  return schema.validate(userData, { abortEarly: false });

};