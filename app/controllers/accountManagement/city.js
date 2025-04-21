const dateService = require('@services/dateService');
const { models, sequelize } = require('@models/');
const { CityModel, UserViewModel,CodingDataModel,CodeTableListModel } = models;
const errMessages = require('@services/errorMessages');
const Joi = require('joi');
const coding = require('@constants/codingDataTables.js');

const title = 'مدیریت اطلاعات پایه '
const subTitle = 'فهرست شهرها '

exports.getData = async (req, res, next) => {
  try {
    const result = await CityModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model:CodingDataModel,
          as:'province',
          attributes:['title']
        }
      ]
    });
     console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.index = async (req, res, next) => {
  try {

    res.adminRender('./accManagement/city/index', {
      title,
      subTitle,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const provinceListData = await CodingDataModel.findAll({ 
      attributes:['id','title'],
      include: [{
        model: CodeTableListModel,
        where: {en_TableName: coding.CODING_PROVINCE}
      }],
      raw: true,
      nest: true
    })
    
    res.adminRender('./accManagement/city/create', {
      title,
      subTitle,
      provinceListData,
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

    const cityData = {
      cityName: req.body.cityName,
      provinceId: req.body.provinceId,
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

    const { id } = await CityModel.create(cityData); 

    if (id) {
      req.flash('success', 'اطلاعات شهر با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const cityId = req.params.id;

    const cityData = await CityModel.findOne({
      where: { id: cityId },
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
          model:CodingDataModel,
          as: 'province',
          attributes: ['title'],
        }
      ],
      raw: true,
      nest: true,
    });

    if (cityData) {
      cityData.fa_createdAt = dateService.toPersianDate(cityData.createdAt);
      cityData.fa_updatedAt = dateService.toPersianDate(cityData.updatedAt);
    }

    // console.log('creator.fullName : ', personData.creator.fullName, 'updater.fullname : ', personData.updater.fullName);

    res.adminRender('./accManagement/city/edit', {
      title,
      subTitle,
      cityData,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const cityId = req.params.id;

    const { error } = formValidation(req);
    if (error) {
      req.flash(
        'errors',
        error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${cityId}`);
    }

    const rowsAffected = await CityModel.update(
      {
        cityName: req.body.cityName,
        description: req.body.description,
        updaterId: req.session?.user?.id ?? 0,
      },
      { where: { id: cityId }, individualHooks: true }
    );

    if (rowsAffected[0] > 0) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect(`../index`);
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');

    return res.redirect(`../edit/${cityId}`);
  } catch (error) {

    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const cityId = req.params.id;
    const rowsAffected = await CityModel.destroy({
      where: { id: cityId }
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
  const cityData = {
    cityName: req.body.cityName
  };

  const schema = Joi.object({
    cityName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label('نام شهر')
      .messages({
        'string.empty': errMessages['string.empty'],
        'string.min': errMessages['string.min'],
        'string.max': errMessages['string.max'],
        'string.required': errMessages['any.required'],
      }),


  });

  return schema.validate(cityData, { abortEarly: false });
};
