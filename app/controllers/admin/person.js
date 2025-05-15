const dateService = require('@services/dateService');
const { models } = require('@models/');
const { PersonModel, UserViewModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

exports.getData = async (req, res, next) => {
  try {
    const result = await PersonModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        }
      ]
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    res.adminRender('./admin/person/index', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست پروفایل کاربران'
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    res.adminRender('./admin/person/create', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'تعریف پرفایل جدید'
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

    const personData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationalCode: req.body.nationalCode,
      mobile: req.body.mobile,
      Description: req.body.Description,
      profilePicture: req.body.profilePicture || 'default-avatar.jpg', // اگر تصویری انتخاب نشده باشد، از تصویر پیش‌فرض استفاده می‌شود
      creatorId: userId
    };
    // console.log(personData);

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
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const personId = req.params.id;

    const personData = await PersonModel.findOne({
      where: { id: personId },
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

    if (personData) {
      personData.fa_createdAt = dateService.toPersianDate(personData.createdAt);
      personData.fa_updatedAt = dateService.toPersianDate(personData.updatedAt);
    }

    res.adminRender('./admin/person/edit', {
      title: 'مدیریت کاربران سیستم',
      subTitle: 'اصلاح کاربر',
      personData,
      profilePictures: [
        { value: 'man1.jpg', label: 'تصویر پروفایل 1' },
        { value: 'man2.jpg', label: 'تصویر پروفایل 2' },
        { value: 'man3.jpg', label: 'تصویر پروفایل 3' },
        { value: 'man4.jpg', label: 'تصویر پروفایل 4' },
        { value: 'man5.jpg', label: 'تصویر پروفایل 5' },
        { value: 'woman1.jpg', label: 'تصویر پروفایل 6' },
        { value: 'woman2.jpg', label: 'تصویر پروفایل 7' },
        { value: 'woman3.jpg', label: 'تصویر پروفایل 8' },
        { value: 'woman4.jpg', label: 'تصویر پروفایل 9' }
      ]
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const personId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${personId}`);
    }

    // let profilePictureData = null;
    // if (req.body.profilePicture) {
    //   const imagePath = path.join(__dirname, '../../../public/static/assets/images/avatars', req.body.profilePicture);
    //   profilePictureData = fs.readFileSync(imagePath);
    // }

    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationalCode: req.body.nationalCode,
      mobile: req.body.mobile,
      profilePicture: req.body.profilePicture,
      Description: req.body.Description,
      updaterId: req.session?.user?.id ?? 0
    };

    // if (profilePictureData) {
    //   updateData.profilePicture = profilePictureData;
    // }

    const rowsAffected = await PersonModel.update(updateData, { where: { id: personId }, individualHooks: true });

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${personId}`);
  } catch (error) {
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
    next(error);
  }
};

const formValidation = (req) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationalCode: req.body.nationalCode,
    mobile: req.body.mobile,
    profilePicture: req.body.profilePicture
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
      }),

    profilePicture: Joi.string().allow(null, '').label('تصویر پروفایل').messages({
      'string.base': '{#label} باید یک رشته متنی باشد'
    })
  });

  return schema.validate(userData, { abortEarly: false });
};
