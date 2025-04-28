const Joi = require('joi');
const authService = require('@services/authService');
const errMessages = require('@services/errorMessages');
const { models } = require('@models/');
const { RoleModel, UserViewModel, PermissionModel, CodingDataModel, UserRoleModel, RolePermissionModel } = models;

exports.login = async (req, res, next) => {
  try {
    // Generate random 4-digit captcha
    const captcha = Math.floor(1000 + Math.random() * 9000);
    req.session.captcha = captcha;
    
    res.authRender('./auth/login', { captcha });
  } catch (error) {
    next(error);
  }
};

exports.doLogin = async (req, res, next) => {
  const { username, password, captcha } = req.body;

  // Check captcha first
  if (!req.session.captcha || req.session.captcha.toString() !== captcha) {
    req.flash('errors', 'کد امنیتی وارد شده صحیح نیست');
    return res.redirect('/auth/login');
  }

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

  const user = await authService.login(username, password);

  if (!user) {
    req.flash('errors', 'نام کاربری یا کلمه عبور معتبر نیست');
    return res.redirect('/auth/login');
  }

  if (user.isActive === false) {
    req.flash('errors', 'نام کاربری شما غیر فعال است؛ لطفا با مدیر سیستم تماس بگیرید.');
    return res.redirect('/auth/login');
  }

  // Clear captcha after successful validation
  delete req.session.captcha;

  try {
    const userRoles = await UserViewModel.findByPk(user.id, {
      attributes: ['id', 'fullName', 'username'],

      include: [
        {
          model: UserRoleModel,
          as: 'userRoles',
          include: [
            {
              model: RoleModel,
              as: 'roles',
              attributes: ['id', 'name'],
              include: [
                {
                  model: RolePermissionModel,
                  as: 'rolePermissions',
                  include: [
                    {
                      model: PermissionModel,
                      as: 'permissions',
                      attributes: ['id', 'name', 'entity_type', 'actionId'],
                      include: [
                        {
                          model: CodingDataModel,
                          as: 'action',
                          attributes: ['id', 'title']
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if(!userRoles){
      const userRoles = await UserViewModel.findByPk(user.id, {
        attributes: ['id', 'fullName', 'username'],
        include: [
          {
            model: UserRoleModel,
            as: 'userRoles',
            include: [
              {
                model: RoleModel,
                as: 'roles',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      const userPermissionLists = userRoles.userRoles.flatMap((userRole) =>
        userRole.roles.rolePermissions.map((rolePerm) => ({
          userFullname: userRoles.fullName, // نام کامل کاربر
          username: userRoles.username, // نام  کاربر
          roleId: userRole.roles.id, // آی‌دی نقش
          roleName: userRole.roles.name // نام نقش
        }))
      );
      req.session.user = user;
      req.session.permissions = userPermissionLists;
  
      return res.redirect('../accManagement/index');
  
    }

    const userPermissionLists = userRoles.userRoles.flatMap((userRole) =>
      userRole.roles.rolePermissions.map((rolePerm) => ({
        userFullname: userRoles.fullName, // نام کامل کاربر
        username: userRoles.username, // نام  کاربر
        permissionId: rolePerm.permissions.id, // آی‌دی مجوز
        permissionName: rolePerm.permissions.name, // نام مجوز
        permissionEntity_type: rolePerm.permissions.entity_type, // نام مجوزe, // نام مجوز
        actionName: rolePerm.permissions.action.title, // نام اکشن
        roleId: userRole.roles.id, // آی‌دی نقش
        roleName: userRole.roles.name // نام نقش
      }))
    );

    // console.log(userPermissionLists[0].roleName);

    req.session.user = user;
    req.session.permissions = userPermissionLists;

    return res.redirect('../accManagement/index');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  req.session.destroy();
  return res.redirect('/auth/login');
};

const formValidation = (req) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    captcha: req.body.captcha
  };

  const schema = Joi.object({
    username: Joi.string().min(10).max(10).required().label('نام کاربری (کد ملی)').pattern(/^\d+$/).messages({
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
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.required': errMessages['any.required']
      }),
    captcha: Joi.string()
      .required()
      .label('کد امنیتی')
      .messages({
        'string.empty': 'لطفا کد امنیتی را وارد کنید',
        'string.required': 'کد امنیتی الزامی است'
      })
  });

  return schema.validate(userData, { abortEarly: false });
};
