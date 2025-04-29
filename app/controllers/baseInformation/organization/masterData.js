const { models, } = require('@models/');
const {  UserViewModel, CodingDataModel, CodeTableListModel,  OrganizationMasterDataModel } = models;
const coding = require('@constants/codingDataTables.js');

const path = require('path');
const fs = require('fs');

const title = 'مدیریت اطلاعات پایه ';
const subTitle = 'فهرست دستگاه ها ';

exports.getData = async (req, res, next) => {
  try {
    
    res.json({
      nationalCode: '123',
      organizationName: 'test',
      registerDate: '2025-04-29',
      registerNo: '123',
      province: 'test',
      organizationType: 'test',
      organizationCategory: 'test',
      creator: 'test'
    });

    // const result = await OrganizationMasterDataModel.findAll({
    //   include: [
    //     {
    //       model: UserViewModel,
    //       as: 'creator',
    //       attributes: ['username', 'fullName']
    //     },
    //     {
    //       model: CodingDataModel,
    //       as: 'province',
    //       attributes: ['title']
    //     },
    //     {
    //       model: CodingDataModel,
    //       as: 'organizationType',
    //       attributes: ['title']
    //     },
    //     {
    //       model: CodingDataModel,
    //       as: 'organizationCategory',
    //       attributes: ['title']
    //     },
    //     // {
    //     //   model: OrganizationMasterDataModel,
    //     //   as: 'parentOrganization',
    //     //   attributes: ['organizationName']
    //     // } 
    //   ],
      
    // });
    // // console.log(result);

    // res.json(result);
  } catch (error) {
    next(error);
  }
};

// نمایش لیست سازمان‌ها
exports.index = async (req, res, next) => {
  try {
    res.render('./baseInformation/organization/masterData/index', {
      title,
      subTitle,
    });
  } catch (error) {
    next(error);
  } 
};

// نمایش فرم ایجاد سازمان جدید
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
    });

    const organizationTypesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_TYPE }
        }
      ],
    });

    const organizationCategoriesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ORGANIZATION_CATEGORY }
        }
      ],
    });
    const parentOrganizationsListData = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName'],
    });

    res.render('baseInformation/organization/create', {
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

// ذخیره سازمان جدید
exports.store = async (req, res, next) => {
  try {
    const {
      nationalCode,
      organizationName,
      registerDate,
      registerNo,
      postalCode,
      address,
      provinceId,
      organizationTypeId,
      organizationCategoryId,
      description
    } = req.body;

    // آپلود فایل‌ها
    const files = {
      filePathStatute: req.files?.filePathStatute?.[0],
      filePathFinancial: req.files?.filePathFinancial?.[0],
      filePathFoundationAd: req.files?.filePathFoundationAd?.[0]
    };

    const filePaths = {};
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join('uploads', 'organizations', fileName);
        fs.writeFileSync(filePath, file.buffer);
        filePaths[key] = filePath;
      }
    }

    const organization = await OrganizationMasterDataModel.create({
      nationalCode,
      organizationName,
      registerDate,
      registerNo,
      postalCode,
      address,
      provinceId,
      organizationTypeId,
      organizationCategoryId,
      description,
      ...filePaths,
      creatorId: req.user.id
    });

    res.redirect('/baseInformation/organization');
  } catch (error) {
   next(error);
  }
};

// نمایش فرم ویرایش سازمان
exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationData = await OrganizationMasterDataModel.findByPk(id, {
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
      ]
    });

    if (!organizationData) {
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

    res.render('./baseInformation/organization/masterData/edit', {
      title,
      subTitle,
      organizationData,
      provincesListData,
      organizationTypesListData,
      organizationCategoriesListData
    }); 



  } catch (error) {
    next(error);
  }
};

// بروزرسانی اطلاعات سازمان
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nationalCode,
      organizationName,
      registerDate,
      registerNo,
      postalCode,
      address,
      provinceId,
      organizationTypeId,
      organizationCategoryId,
      description
    } = req.body;

    const organization = await OrganizationMasterDataModel.findByPk(id);
    if (!organization) {
      return res.status(404).send('سازمان مورد نظر یافت نشد');
    }

    // آپلود فایل‌های جدید
    const files = {
      filePathStatute: req.files?.filePathStatute?.[0],
      filePathFinancial: req.files?.filePathFinancial?.[0],
      filePathFoundationAd: req.files?.filePathFoundationAd?.[0]
    };

    const filePaths = {};
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        // حذف فایل قدیم
        if (organization[key]) {
          fs.unlinkSync(organization[key]);
        }

        // ذخیره فایل جدید
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join('uploads', 'organizations', fileName);
        fs.writeFileSync(filePath, file.buffer);
        filePaths[key] = filePath;
      }
    }

    await organization.update({
      nationalCode,
      organizationName,
      registerDate,
      registerNo,
      postalCode,
      address,
      provinceId,
      organizationTypeId,
      organizationCategoryId,
      description,
      ...filePaths,
      updaterId: req.user.id
    });

    res.redirect('/baseInformation/organization');
  } catch (error) {
   next(error);
  }
};

// حذف سازمان
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationMasterDataModel.findByPk(id);

    if (!organization) {
      return res.status(404).send('سازمان مورد نظر یافت نشد');
    }

    // حذف فایل‌ها
    const files = [
      organization.filePathStatute,
      organization.filePathFinancial,
      organization.filePathFoundationAd
    ];

    for (const file of files) {
      if (file && fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }

    await organization.destroy();
    res.redirect('/baseInformation/organization');
  } catch (error) {
    next(error);
  }
};