const dateService = require('@services/dateService');
const { models } = require('@models/');
const { UserRoleModel, UserViewModel, RoleModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

const title = 'مدیریت کاربران سیستم';
const subTitle = 'فهرست نقش‌های کاربران ';

exports.getData = async (req, res, next) => {
  try {
    
    const result = await UserRoleModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: UserViewModel,
          as: 'usersView',
          attributes: ['fullName']
        },
        {
          model: RoleModel,
          as: 'roles',
          attributes: ['name']
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
    res.adminRender('./admin/userRole/index', {
      title,
      subTitle,
      
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const roleListData = await RoleModel.findAll({
      attributes: ['id', 'name'],
      raw: true,
      nest: true
    });

    const userListData = await UserViewModel.findAll({
      attributes: ['id', 'fullName'],
      raw: true,
      nest: true
    });

    res.adminRender('./admin/userRole/create', {
      title,
      subTitle,
      roleListData,
      userListData
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

    const userRoleData = {
      roleId: req.body.roleId,
      userId: req.body.userId,
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

    const { id } = await UserRoleModel.create(userRoleData);

    if (id) {
      req.flash('success', 'اطلاعات کاربر با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    next(error);
  }
};

exports.bulkStore = async (req, res, next) => {
  try {
    let userId = 'null';
    if (req.session && req.session.user) {
      userId = req.session?.user?.id ?? 0;
    }

    const userRoleData = {
      userId: req.body.userId,
      roleIds: req.body.roleIds,
      description: req.body.description,
      creatorId: userId
    };

    //اعتبار سنجی فرم ورودی - Start

    // const { error } = formValidation(req);
    if (!userRoleData.userId || !userRoleData.roleIds) {
      req.flash('errors', 'کاربر و حداقل یک نقش را انتخاب کنید!');

      return res.redirect('./create');
    }

    //اعتبار سنجی فرم ورودی - End

    const roleArray = Array.isArray(userRoleData.roleIds) ? userRoleData.roleIds : [userRoleData.roleIds];

    await UserRoleModel.destroy({ where: { userId: userRoleData.userId } });

    const userRoles = roleArray.map((roleId) => ({
      userId: userRoleData.userId,
      roleId,
      creatorId: userRoleData.creatorId,
      description: userRoleData.description
    }));

    await UserRoleModel.bulkCreate(userRoles);

    req.flash('success', 'مجوزهای نقش با موفقیت ثبت شد.');
    return res.redirect('./index');
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const userRoleId = req.params.id;

    const userRoleData = await UserRoleModel.findOne({
      where: { id: userRoleId },
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
        },
        {
          model: RoleModel,
          as: 'role',
          attributes: ['name']
        },
        {
          model: UserViewModel,
          as: 'user',
          attributes: ['fullName']
        }
      ],
      raw: true,
      nest: true
    });

    if (userRoleData) {
      userRoleData.fa_createdAt = dateService.toPersianDate(userRoleData.createdAt);
      userRoleData.fa_updatedAt = dateService.toPersianDate(userRoleData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./admin/userRole/edit', {
      title,
      subTitle,
      userRoleData
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userRoleId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${userRoleId}`);
    }

    const rowsAffected = await UserRoleModel.update(
      {
        roleId: req.body.roleId,
        permissionId: req.body.permissionId,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0
      },
      { where: { id: userRoleId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${userRoleId}`);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userRoleId = req.params.id;
    
    if(req.session.permissions.some(item => item.roleName.toLowerCase() === 'admin')){
      req.flash('errors', 'امکان حذف اطلاعات برای کاربر ادمین وجود ندارد .');
      return res.redirect('../index');
    }

    const rowsAffected = await UserRoleModel.destroy({
        where: { id: userRoleId }
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
    roleId: req.body.roleId,
    userId: req.body.userId
  };

  const schema = Joi.object({
    roleId: Joi.number().required().label('نام نقش').messages({
      'number.empty': errMessages['string.empty'],
      'any.required': errMessages['any.required']
    }),
    userId: Joi.number().required().label('نام کاربر').messages({
      'number.empty': errMessages['string.empty'],
      'any.required': errMessages['any.required']
    })
  });

  return schema.validate(permissionData, { abortEarly: false });
};
