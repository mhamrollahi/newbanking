const Joi = require('joi');
const authService = require('@services/authService');
const errMessages = require('@services/errorMessages');

exports.login = async (req, res, next) => {
  try {
    const errors = req.flash('errors');
    const hasError = errors.length > 0;

    res.render('./auth/login', {
      layout: 'auth',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست کاربران',
      errors,
      hasError
    });
  } catch (error) {
    next(error);
  }
};

exports.doLogin = async (req, res, next) => {
  const { userName, password } = req.body;

  //اعتبار سنجی فرم ورودی - Start
  const { error } = formValidation(req, 0);
  if (error) {
    req.flash(
      'errors',
      error.details.map((err) => err.message)
    );
    return res.redirect('/auth/login');
  }
  //اعتبار سنجی فرم ورودی - End

  const user = await authService.login(userName, password);

  if (!user) {
    req.flash('errors', 'نام کاربری یا کلمه عبور معتبر نیست');
    return res.redirect('/auth/login');
  }
  req.session.user = user 
  
  return res.redirect('../accManagement/index');
};

const formValidation = (req) => {
  const userData = {
    userName: req.body.userName,
    password: req.body.password
  };

  const schema = Joi.object({
    userName: Joi.string().min(10).max(10).required().label('نام کاربری (کد ملی)').pattern(/^\d+$/).messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required'],
      'string.pattern.base': 'نام کاربری (کد ملی) می بایست فقط عدد باشد.'
    }),
    password: Joi.string()
      .min(6)
      .label('کلمه عبور')
      .required()
      .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,20}$/)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.required': errMessages['any.required'],
        'string.pattern.base': 'رمز عبور باید حداقل شامل یک عدد، یک کاراکتر خاص (!@#$%^&*) و حروف باشد و حداقل ۶ کاراکتر داشته باشد.'
      })
  });

  return schema.validate(userData, { abortEarly: false });
};
