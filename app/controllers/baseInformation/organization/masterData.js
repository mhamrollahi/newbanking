const { models } = require('@models/');
const { UserViewModel, CodingDataModel, CodeTableListModel, OrganizationMasterDataModel } = models;
const coding = require('@constants/codingDataTables.js');
const dateService = require('@services/dateService.js');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const { organizationSchema } = require('@validators/organization/masterData');
const title = 'مدیریت اطلاعات پایه ';
const subTitle = 'فهرست دستگاه ها ';

exports.getData = async (req, res, next) => {
  try {
    const result = await OrganizationMasterDataModel.findAll({
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: CodingDataModel,
          as: 'province',
          attributes: ['title']
        },
        {
          model: CodingDataModel,
          as: 'organizationType',
          attributes: ['title']
        },
        {
          model: CodingDataModel,
          as: 'organizationCategory',
          attributes: ['title']
        }
        // {
        //   model: OrganizationMasterDataModel,
        //   as: 'parentOrganization',
        //   attributes: ['organizationName']
        // }
      ]
    });
    // console.log(result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// نمایش لیست سازمان‌ها
exports.index = async (req, res, next) => {
  try {
    res.adminRender('./baseInformation/organization/masterData/index', {
      title,
      subTitle
    });
  } catch (error) {
    next(error);
  }
};

// نمایش فرم ایجاد دستگاه جدید
exports.create = async (req, res, next) => {
  try {
    const provincesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_PROVINCE }
        }
      ],
      raw: true,
      nest: true
    });

    const organizationTypesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_TYPE }
        }
      ],
      raw: true,
      nest: true
    });

    const organizationCategoriesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_CATEGORY }
        }
      ],
      raw: true,
      nest: true
    });

    const parentOrganizationsListData = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName','nationalCode'],
      raw: true,
      nest: true
    });

    res.adminRender('./baseInformation/organization/masterData/create', {
      title,
      subTitle,
      provincesListData,
      organizationTypesListData,
      organizationCategoriesListData,
      parentOrganizationsListData
    });
  } catch (error) {
    next(error);
  }
};

// ذخیره دستگاه جدید
exports.store = async (req, res, next) => {
  try {
    const { nationalCode, organizationName, registerDate, registerNo, postalCode, address, parentOrganizationId, provinceId, organizationTypeId, organizationCategoryId, description } = req.body;

    // const cleanRegisterDate = !registerDate || registerDate.trim() === '' ? null : registerDate;
    // const cleanRegisterDate = !registerDate || registerDate.trim() === '' ? null : dateService.toEnglishDate(registerDate);

    const validationResult = organizationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (validationResult.error) {
      req.flash(
        'errors',
        validationResult.error.details.map((err) => err.message)
      );
      return res.redirect('./create');
    }

    const { id } = await OrganizationMasterDataModel.create({
      nationalCode,
      organizationName,
      registerDate,
      registerNo: registerNo == '' ? null : registerNo,
      postalCode: postalCode == '' ? null : postalCode,
      address: address == '' ? null : address,
      parentOrganizationId: parentOrganizationId == '' ? null : parentOrganizationId,
      provinceId: provinceId == '' ? null : provinceId,
      organizationTypeId: organizationTypeId == '' ? null : organizationTypeId,
      organizationCategoryId: organizationCategoryId == '' ? null : organizationCategoryId,
      description,
      creatorId: req.session.user.id
    });

    if (id) {
      req.flash('success', 'اطلاعات دستگاه با موفقیت ثبت شد.');
      return res.redirect('./index');
    }
  } catch (error) {
    next(error);
  }
};

// نمایش فرم ویرایش دستگاه
exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationMasterDataModel.findByPk(id, {
      include: [
        {
          model: UserViewModel,
          as: 'creator',
          attributes: ['username', 'fullName']
        },
        {
          model: UserViewModel,
          as: 'updater',
          attributes: ['username', 'fullName']
        },
        {
          model: CodingDataModel,
          as: 'province',
          attributes: ['id', 'title']
        },
        {
          model: CodingDataModel,
          as: 'organizationType',
          attributes: ['id', 'title']
        },
        {
          model: CodingDataModel,
          as: 'organizationCategory',
          attributes: ['id', 'title']
        }, 
        {
          model: OrganizationMasterDataModel,
          as: 'parentOrganization',
          attributes: ['id', 'organizationName','nationalCode']
        },
      ],
      raw: true,
      nest: true
    });

    if (!organization) {
      return res.redirect('/error/404');
    }

    const provincesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_PROVINCE }
        }
      ],
      raw: true,
      nest: true
    });

    const organizationTypesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_TYPE }
        }
      ],
      raw: true,
      nest: true
    });

    const organizationCategoriesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_CATEGORY }
        }
      ],
      raw: true,
      nest: true
    });

    const parentOrganizationsListData = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName','nationalCode'],
      raw: true,
      nest: true
    });

    if (organization) {
      organization.fa_createdAt = dateService.toPersianDate(organization.createdAt);
      organization.fa_updatedAt = dateService.toPersianDate(organization.updatedAt);
      const dateStr = organization.registerDate == null ? '' : organization.registerDate.toISOString().split('T')[0];
      organization.registerDate = dateStr.replace(/-/g, '/');
    }

    res.adminRender('./baseInformation/organization/masterData/edit', {
      title,
      subTitle,
      organization,
      provincesListData,
      organizationTypesListData,
      organizationCategoriesListData,
      parentOrganizationsListData,
    });
  } catch (error) {
    next(error);
  }
};

// بروزرسانی اطلاعات دستگاه
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nationalCode, organizationName, registerDate, registerNo, postalCode, address, parentOrganizationId, provinceId, organizationTypeId, organizationCategoryId, description } = req.body;

    const validationResult = organizationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (validationResult.error) {
      req.flash(
        'errors',
        validationResult.error.details.map((err) => err.message)
      );
      return res.redirect(`../edit/${id}`);
    }

    const organization = await OrganizationMasterDataModel.findByPk(id);
    if (!organization) {
      return res.status(404).send('دستگاه مورد نظر یافت نشد');
    }

    const rowsAffected = await organization.update(
      {
        nationalCode,
        organizationName,
        registerDate,
        registerNo: registerNo == '' ? null : registerNo,
        postalCode: postalCode == '' ? null : postalCode,
        address: address == '' ? null : address,
        parentOrganizationId: parentOrganizationId == '' ? null : parentOrganizationId,
        provinceId: provinceId == '' ? null : provinceId,
        organizationTypeId: organizationTypeId == '' ? null : organizationTypeId,
        organizationCategoryId: organizationCategoryId == '' ? null : organizationCategoryId,
        description,
        updaterId: req.session.user.id
      },
      { where: { id }, individualHooks: true }
    );

    if (rowsAffected) {
      req.flash('success', 'اطلاعات با موفقیت اصلاح شد.');
      return res.redirect('../index');
    }

    req.flash('errors', 'اصلاح اطلاعات با مشکل مواجه شد . لطفا مجددا سعی کنید...');
    return res.redirect(`../edit/${id}`);
  } catch (error) {
    next(error);
  }
};

// حذف دستگاه
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rowsAffected = await OrganizationMasterDataModel.destroy({
      where: { id }
    });

    if (rowsAffected > 0) {
      req.flash('success', 'اطلاعات با موفقیت حذف شد.');
      return res.redirect('../index');
    }
  } catch (error) {
    next(error);
  }
};
