const dateService = require('@services/dateService');
const { models,  } = require('@models/');
const { PermissionModel, UserViewModel,RolePermissionModel,RoleModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

const title = 'مدیریت کاربران سیستم';
const subTitle = 'فهرست مجوز‌های نقش ';

exports.getData = async (req, res, next) => {
  try {
    const result = await RolePermissionModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: RoleModel,
          as: 'role',
          attributes: ['name']
        },
        {
          model: PermissionModel,
          as: 'permission',
          attributes: ['name']
        },
      ]
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {

    res.adminRender('./admin/rolePermission/index', {
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
      attributes:['id','name'],
      raw: true,
      nest: true
    })
    
    const permissionListData = await PermissionModel.findAll({ 
      attributes:['id','name'],
      raw: true,
      nest: true
    })
    

    res.adminRender('./admin/rolePermission/create', {
      title,
      subTitle,
      roleListData,
      permissionListData,
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

    const rolePermissionData = {
      roleId: req.body.roleId,
      permissionId: req.body.permissionId,
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

    const { id } = await RolePermissionModel.create(rolePermissionData);  

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

    const rolePermissionData = {
      roleId: req.body.roleId,
      permissionIds: req.body.permissionIds,
      description: req.body.description,
      creatorId: userId
    };

    //اعتبار سنجی فرم ورودی - Start

    // const { error } = formValidation(req);
    if(!rolePermissionData.roleId ||!rolePermissionData.permissionIds)
   {
      req.flash('errors','نقش و حداقل یک مجوز را انتخاب کنید!')
      
      return res.redirect('./create');
    }

    //اعتبار سنجی فرم ورودی - End

    const permissionArray = Array.isArray(rolePermissionData.permissionIds) ? rolePermissionData.permissionIds : [rolePermissionData.permissionIds];

    await RolePermissionModel.destroy({ where: { roleId: rolePermissionData.roleId } });
    
    const rolePermissions = permissionArray.map((permissionId) => ({ 
      roleId: rolePermissionData.roleId, 
      permissionId, 
      creatorId: rolePermissionData.creatorId, 
      description: rolePermissionData.description 
    }));

    await RolePermissionModel.bulkCreate(rolePermissions);    

    req.flash('success', 'مجوزهای نقش با موفقیت ثبت شد.');
    return res.redirect('./index');
    
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const rolePermissionId = req.params.id;

    const rolePermissionData = await RolePermissionModel.findOne({
      where: { id: rolePermissionId },
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
          model: PermissionModel,
          as: 'permission',
          attributes: ['name']
        },
      ],
      raw: true,
      nest: true,
    });

    if (rolePermissionData) {
      rolePermissionData.fa_createdAt = dateService.toPersianDate(rolePermissionData.createdAt);
      rolePermissionData.fa_updatedAt = dateService.toPersianDate(rolePermissionData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./admin/rolePermission/edit', {
      title,
      subTitle,
      rolePermissionData,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const rolePermissionId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${rolePermissionId}`);
    }

    const rowsAffected = await PermissionModel.update(
      {
        roleId: req.body.roleId,
        permissionId: req.body.permissionId,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0,
      }, 
      { where: { id: rolePermissionId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${rolePermissionId}`);
  } catch (error) {

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const rolePermissionId = req.params.id;
    const rowsAffected = await RolePermissionModel.destroy({
      where: { id: rolePermissionId }
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
    permissionId: req.body.permissionId,
  };

  const schema = Joi.object({
    roleId: Joi.number()
      .required()
      .label('نام نقش')
      .messages({
        'number.empty': errMessages['string.empty'],
        'any.required': errMessages['any.required'],
      }),
    permissionId: Joi.number()
      .required()
      .label('نام مجوز')
      .messages({
        'number.empty': errMessages['string.empty'],
        'any.required': errMessages['any.required'],
      }),
  });

  return schema.validate(permissionData, { abortEarly: false });
};
