const Joi = require('joi');
const errMessages = require('@services/errorMessages');

// تابع کمکی برای تبدیل اعداد فارسی به انگلیسی
const convertPersianToEnglish = (value) => {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let convertedValue = value;
  for (let i = 0; i < 10; i++) {
    convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
  }
  return convertedValue;
};

// تابع کمکی برای اعتبارسنجی اعداد
const validateNumbers = (value, helpers) => {
  if (!value) return value; // Skip validation if value is empty/null
  const convertedValue = convertPersianToEnglish(value);
  if (!/^\d+$/.test(convertedValue)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// تابع کمکی برای اعتبارسنجی فایل‌ها
const validateFile = (value, helpers) => {
  if (!value) return value;

  // بررسی حجم فایل (5MB)
  if (value.size > 5 * 1024 * 1024) {
    return helpers.error('any.invalid');
  }

  // بررسی نوع فایل (PDF)
  if (value.mimetype !== 'application/pdf') {
    return helpers.error('any.invalid');
  }

  return value;
};

const organizationSchema = Joi.object({
  nationalCode: Joi.string().required().length(11).label('شناسه ملی').custom(validateNumbers, 'اعتبارسنجی اعداد').messages({
    'string.empty': errMessages['string.empty'],
    'string.length': errMessages['string.length'],
    'any.required': errMessages['any.required'],
    'any.invalid': errMessages['any.invalid']
  }),

  organizationName: Joi.string().required().min(1).max(200).label('نام دستگاه').messages({
    'string.empty': errMessages['string.empty'],
    'string.min': errMessages['string.min'],
    'string.max': errMessages['string.max'],
    'any.required': errMessages['any.required']
  }),

  registerDate: Joi.date().allow('').label('تاریخ ثبت').messages({
    'date.base': errMessages['date.base']
  }),

  registerNo: Joi.string().allow('').max(10).label('شماره ثبت').custom(validateNumbers, 'اعتبارسنجی اعداد').messages({
    'string.max': errMessages['string.max'],
    'any.invalid': errMessages['any.invalid']
  }),

  postalCode: Joi.string().allow('').length(10).label('کد پستی').custom(validateNumbers, 'اعتبارسنجی اعداد').messages({
    'string.length': errMessages['string.length'],
    'any.invalid': errMessages['any.invalid']
  }),

  address: Joi.string().allow('').max(200).label('آدرس').messages({
    'string.max': errMessages['string.max']
  }),

  provinceId: Joi.number().integer().allow('').label('استان').messages({
    'number.base': errMessages['number.base'],
    'number.integer': errMessages['number.integer']
  }),

  organizationTypeId: Joi.number().integer().allow('').label('نوع دستگاه').messages({
    'number.base': errMessages['number.base'],
    'number.integer': errMessages['number.integer'],
   
  }),

  organizationCategoryId: Joi.number().integer().allow('').label('دسته بندی دستگاه').messages({
    'number.base': errMessages['number.base'],
    'number.integer': errMessages['number.integer']
  }),

  filePathStatute: Joi.object().allow('').custom(validateFile, 'اعتبارسنجی فایل').messages({
    'any.invalid': errMessages['any.invalid']
  }),

  filePathFinancial: Joi.object().allow('').custom(validateFile, 'اعتبارسنجی فایل').messages({
    'any.invalid': errMessages['any.invalid']
  }),

  filePathFoundationAd: Joi.object().allow('').custom(validateFile, 'اعتبارسنجی فایل').messages({
    'any.invalid': errMessages['any.invalid']
  }),

  isConfirmed: Joi.boolean().allow('').messages({
    'boolean.base': errMessages['boolean.base']
  }),

  description: Joi.string().allow('').max(255).label('توضیحات').messages({
    'string.max': errMessages['string.max']
  })
});

module.exports = {
  organizationSchema
};
