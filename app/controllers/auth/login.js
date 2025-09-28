const Joi = require('joi');
const authService = require('@services/authService');
const errMessages = require('@services/errorMessages');
const { models } = require('@models/');
const { RoleModel, UserViewModel, PermissionModel, CodingDataModel, UserRoleModel, RolePermissionModel } = models;

exports.login = async (req, res, next) => {
  try {
    res.authRender('./auth/login', {});
  } catch (error) {
    next(error);
  }
};

exports.doLogin = async (req, res, next) => {
  const { username, password } = req.body;

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
                  required : false,
                  as: 'rolePermissions',
                  include: [
                    {
                      model: PermissionModel,
                      as: 'permissions',
                      attributes: ['id', 'name', 'entity_type', 'actionId'],
                      include: [
                        {
                          model: CodingDataModel,
                          required : false,
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
    password: req.body.password
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
      // .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,20}$/)
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.required': errMessages['any.required']
        // 'string.pattern.base': 'رمز عبور باید حداقل شامل یک عدد، یک کاراکتر خاص (!@#$%^&*) و حروف باشد و حداقل ۶ کاراکتر داشته باشد.'
      })
  });

  return schema.validate(userData, { abortEarly: false });
};
