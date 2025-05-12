 const dateService = require('@services/dateService');
const { models } = require('@models/');
const { CodeOnlineModel, UserViewModel, OrganizationMasterDataModel,  } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');

const title = 'مدیریت اطلاعات پایه ';
const subTitle = 'فهرست کدهای آنلاین ';

exports.getData = async (req, res, next) => {
  try {
    const result = await CodeOnlineModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: OrganizationMasterDataModel,
          as: 'organization',
          attributes: ['organizationName','nationalCode']
        }
      ]
    });
    // console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.nextCode = async (req, res, next) => {
  try {
    // دریافت همه کدهای موجود
    const existingCodes = await CodeOnlineModel.findAll({
      attributes: ['code'],
      order: [['code', 'ASC']]
    });

    // تبدیل به آرایه اعداد
    const codeNumbers = existingCodes.map(code => parseInt(code.code));

    // اگر هیچ کدی وجود نداشت، از 1 شروع کن
    if (codeNumbers.length === 0) {
      return res.json({ nextCode: '1' });
    }

    // پیدا کردن اولین عدد گمشده
    let nextNumber = 1;
    for (let i = 0; i < codeNumbers.length; i++) {
      if (codeNumbers[i] !== nextNumber) {
        break;
      }
      nextNumber++;
    }

    // اگر همه اعداد پشت سر هم بودند، یک عدد به آخرین عدد اضافه کن
    if (nextNumber > codeNumbers[codeNumbers.length - 1]) {
      nextNumber = codeNumbers[codeNumbers.length - 1] + 1;
    }

    res.json({ nextCode: nextNumber.toString() });
  } catch (error) {
    next(error);
  }

}

exports.index = async (req, res, next) => {
  try {
    res.adminRender('./baseInformation/account/codeOnline/index', {
      title,
      subTitle
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const  organizationListData  = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName'],
      raw: true,
      nest: true
    });

    res.adminRender('./baseInformation/account/codeOnline/create', {
      title,
      subTitle,
      organizationListData
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

    const codeOnlineData = {
      code: req.body.onlineCode,
      organizationId: req.body.organizationId,
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

    const { id } = await CodeOnlineModel.create(codeOnlineData);

    if (id) {
      req.flash('success', 'اطلاعات کد آنلاین با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const codeOnlineId = req.params.id;

    const codeOnlineData = await CodeOnlineModel.findOne({
      where: { id: codeOnlineId },
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
          model: OrganizationMasterDataModel,
          as: 'organization',
          attributes: ['id', 'organizationName','nationalCode']
        }
      ],
      raw: true,
      nest: true
    });

    // Get all provinces for dropdown
    const organizationListData = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName','nationalCode'],
      raw: true,
      nest: true
    });

    if (codeOnlineData) {
      codeOnlineData.fa_createdAt = dateService.toPersianDate(codeOnlineData.createdAt);
      codeOnlineData.fa_updatedAt = dateService.toPersianDate(codeOnlineData.updatedAt);
    }

    res.adminRender('./baseInformation/account/codeOnline/edit', {
      title,
      subTitle,
      codeOnlineData,
      organizationListData
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const codeOnlineId = req.params.id;

    const { error } = formValidation(req);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${codeOnlineId}`);
    }

    const rowsAffected = await CodeOnlineModel.update(
      {
        code: req.body.code,
        organizationId: req.body.organizationId,
        description: req.body.description,
        updated_at: new Date().toLocaleDateString('en-US'),
        updaterId: req.session?.user?.id ?? 0
      },
      { where: { id: codeOnlineId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${codeOnlineId}`);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const codeOnlineId = req.params.id;
    const rowsAffected = await CodeOnlineModel.destroy({
      where: { id: codeOnlineId }
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
  const codeOnlineData = {
    code: req.body.onlineCode,
    organizationId: req.body.organizationId,
  };

  const schema = Joi.object({
    code: Joi.string().min(1).max(4).required().label('کد آنلاین').messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required']
    }),
    organizationId: Joi.number().required().label('نام دستگاه').messages({
      'number.base': errMessages['number.base'],
      'any.required': errMessages['any.required']
    })
  });

  return schema.validate(codeOnlineData, { abortEarly: false });
};
