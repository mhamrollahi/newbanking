const dateService = require('@services/dateService');
const { models, } = require('@models/');
const { BankBranchModel, UserViewModel, CodingDataModel, CodeTableListModel, CityModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');
const coding = require('@constants/codingDataTables.js');

const title = 'مدیریت اطلاعات پایه ';
const subTitle = 'فهرست شعب بانک ';

exports.getData = async (req, res, next) => {
  try {
    const result = await BankBranchModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: CodingDataModel,
          as: 'bank',
          attributes: ['title']
        },
        {
          model: CityModel,
          as: 'city',
          attributes: ['cityName']
        }
      ]
    });
    // console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {
    res.adminRender('./baseInformation/account/bankbranch/index', {
      title,
      subTitle
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const banksListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_BANK }
        }
      ],
      raw: true,
      nest: true
    });

    const cityListData = await CityModel.findAll({
      attributes: ['id', 'cityName'],

      raw: true,
      nest: true
    });

    res.adminRender('./baseInformation/account/bankbranch/create', {
      title,
      subTitle,
      banksListData,
      cityListData
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

    const bankBranchData = {
      branchName: req.body.branchName,
      branchCode: req.body.branchCode,
      bankId: req.body.bankId,
      cityId: req.body.cityId,
      contactTel: req.body.contactTel,
      address: req.body.address,
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

    const { id } = await BankBranchModel.create(bankBranchData);

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
    const bankBranchId = req.params.id;

    const bankBranchData = await BankBranchModel.findOne({
      where: { id: bankBranchId },
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
          model: CodingDataModel,
          as: 'bank',
          attributes: ['id','title']
        },
        {
          model:CityModel,
          as: 'city',
          attributes: ['id','cityName']
        }
      ],
      raw: true,
      nest: true
    });

    const banksListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_BANK }
        }
      ],
      raw: true,
      nest: true
    });

    const cityListData = await CityModel.findAll({
      attributes: ['id', 'cityName'],

      raw: true,
      nest: true
    });

    if (bankBranchData) {
      bankBranchData.fa_createdAt = dateService.toPersianDate(bankBranchData.createdAt);
      bankBranchData.fa_updatedAt = dateService.toPersianDate(bankBranchData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./baseInformation/account/bankbranch/edit', {
      title,
      subTitle,
      bankBranchData,
      banksListData,
      cityListData,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const bankBranchId = req.params.id;

    const { error } = formValidation(req, 1);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${bankBranchId}`);
    }

    const rowsAffected = await BankBranchModel.update(
      {
        branchName: req.body.branchName,
        branchCode: req.body.branchCode,
        bankId: req.body.bankId,
        cityId: req.body.cityId,
        contactTel: req.body.contactTel,
        address: req.body.address,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0
      },
      { where: { id: bankBranchId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${bankBranchId}`);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bankBranchId = req.params.id;
    const rowsAffected = await BankBranchModel.destroy({
      where: { id: bankBranchId }
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
  const bankBranchData = {
    branchName: req.body.branchName,
    branchCode: req.body.branchCode,
    bankId: req.body.bankId,
    cityId: req.body.cityId
  };

  const schema = Joi.object({
    branchName: Joi.string().min(2).max(200).required().label('نام شعبه').messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required']
    }),

    branchCode: Joi.string().min(1).max(10).required().label('کد شعبه ').messages({
      'string.empty': errMessages['string.empty'],
      'string.min': errMessages['string.min'],
      'string.max': errMessages['string.max'],
      'string.required': errMessages['any.required']
    }),

    bankId: Joi.number().integer().required().label('نام بانک').messages({
      'number.base': '{#label} باید یک عدد باشد',
      'number.integer': '{#label} باید یک عدد صحیح باشد',
      'any.required': errMessages['any.required']
    }),

    cityId: Joi.number().integer().required().label('نام شهر').messages({
      'number.base': '{#label} باید یک عدد باشد',
      'number.integer': '{#label} باید یک عدد صحیح باشد',
      'any.required': errMessages['any.required']
    })
  });

  return schema.validate(bankBranchData, { abortEarly: false });
};
