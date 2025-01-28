const dateService = require('@services/dateService');
const { UserModel } = require('@models/');
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

exports.getData = async (req, res, next) => {
  try {
    const result = await UserModel.findAll({});
    // console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateUserActive = async (req,res,next)=>{
  try {
    const id = await req.params.id
    const {isActive} = req.body
    if(!id || typeof isActive !== 'boolean'){
      req.flash('errors','داده ها نامعتبر می باشد.')
      return res.redirect('./admin/users/index')
    }
    
    const rowsAffected = await UserModel.update({isActive},{where : {id}})
    if(rowsAffected[0] > 0){
      req.flash('success','وضعیت با موفقیت به‌روزرسانی شد.')
      return res.redirect('../../index')
    }

    req.flash('success','اصلاح اطلاعات با مشکل مواجه شد.لطفا مجدد سعی کنید')
    return res.redirect('./admin/users/index')

  } catch (error) {
    next(error)
  }
}

exports.index = async (req, res, next) => {
  try {
    const success = req.flash('success')
    const removeSuccess = req.flash('removeSuccess')

    res.render('./admin/user/index', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست کاربران',
      success,
      removeSuccess,
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

    res.render('./admin/user/create', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'جدید',
      errors,
      hasError,
      success
    });
  } catch (error) {
    next(error);
  }
};

const formValidation = (req) => {
  const userData = {
    userName: req.body.userName,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    fullName: req.body.fullName
  };

  const schema = Joi.object({
    userName: Joi.string().min(10).max(10).required().label('نام کاربری (کد ملی)')
    .pattern(/^\d+$/)
    .messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required'],
      'string.pattern.base' : 'نام کاربری (کد ملی) می بایست فقط عدد باشد.'
    }),
    password: Joi.string().min(6).label('کلمه عبور').required()
    .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,20}$/)
    .messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.required': errMessages['any.required'],
      'string.pattern.base' : 'رمز عبور باید حداقل شامل یک عدد، یک کاراکتر خاص (!@#$%^&*) و حروف باشد و حداقل ۶ کاراکتر داشته باشد.',
    }),
    confirm_password: Joi.string().min(6).label('تاییدیه کلمه عبور').required().valid(Joi.ref('password'))
    .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,20}$/)
    .messages({
      'any.only': 'کلمه عبور و تاییدیه آن با هم مطابقت ندارد.',
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.required': errMessages['any.required'],
      'string.pattern.base' : 'تاییدیه رمز عبور  باید حداقل شامل یک عدد، یک کاراکتر خاص (!@#$%^&*) و حروف باشد و حداقل ۶ کاراکتر داشته باشد.',
    }),
    fullName: Joi.string().min(5).label('نام و نام خانوادگی').required().messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required']
    })
  });

  return schema.validate(userData, { abortEarly: false });

};

exports.store = async (req, res, next) => {
  try {
    const userData = {
      userName: req.body.userName,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      fullName: req.body.fullName,
      creator:'First_Admin',
    };
    console.log(userData);

    //اعتبار سنجی فرم ورودی - Start

    const { error } = formValidation(req)
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect('./create');
    }

    //اعتبار سنجی فرم ورودی - End

    const { id } = await UserModel.create(userData);

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
