const { models } = require('@models/');
const { UserViewModel, CodingDataModel, CodeTableListModel, AccountInfoModel, BankBranchModel, CodeOnlineModel, OrganizationMasterDataModel } = models;
const coding = require('@constants/codingDataTables.js');
const dateService = require('@services/dateService.js');
const { organizationSchema } = require('@validators/organization/masterData');
const title = 'مدیریت اطلاعات حساب ';
const subTitle = 'فهرست حساب ها ';

exports.getData = async (req, res, next) => {
  try {
    const result = await AccountInfoModel.findAll({
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
          as: 'accountType',
          attributes: ['title']
        },
        {
          model: CodingDataModel,
          as: 'transferPeriod',
          attributes: ['title']
        },
        {
          model: BankBranchModel,
          as: 'bankBranch',
          attributes: ['branchName', 'branchCode']
        },
        {
          model: CodeOnlineModel,
          as: 'codeOnline',
          attributes: ['code']
        },
        {
          model: OrganizationMasterDataModel,
          as: 'organization',
          attributes: ['organizationName']
        }
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
    res.adminRender('./accManagement/accountOpen/index', {
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

    const bankBranchesListData = await BankBranchModel.findAll({
      attributes: ['id', 'branchName', 'branchCode'],
      raw: true,
      nest: true
    });

    const accountTypesListData = await CodingDataModel.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: CodeTableListModel,
          where: { en_TableName: coding.CODING_ACCOUNT_TYPE }
        }
      ],
      raw: true,
      nest: true
    });

    const organizationListData = await OrganizationMasterDataModel.findAll({
      attributes: ['id', 'organizationName','nationalCode','budgetRow'],
      raw: true,
      nest: true
    });

    res.adminRender('./accManagement/accountOpen/create', {
      title,
      subTitle,
      provincesListData,
      banksListData,
      bankBranchesListData,
      accountTypesListData,
      organizationListData
    });
  } catch (error) {
    next(error);
  }
};

// ذخیره دستگاه جدید
exports.store = async (req, res, next) => {
  try {
    const { nationalCode, organizationName, budgetRow, registerDate, registerNo, postalCode, address, parentOrganizationId, provinceId, organizationTypeId, organizationCategoryId, description } = req.body;

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
      budgetRow,
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
          attributes: ['id', 'organizationName', 'nationalCode']
        }
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
      attributes: ['id', 'organizationName', 'nationalCode'],
      raw: true,
      nest: true
    });

    if (organization) {
      organization.fa_createdAt = dateService.toPersianDate(organization.createdAt);
      organization.fa_updatedAt = dateService.toPersianDate(organization.updatedAt);
      const dateStr = organization.registerDate == null ? '' : organization.registerDate.toISOString().split('T')[0];
      organization.registerDate = dateStr.replace(/-/g, '/');
    }

    res.adminRender('./accManagement/accountOpen/edit', {
      title,
      subTitle,
      organization,
      provincesListData,
      organizationTypesListData,
      organizationCategoriesListData,
      parentOrganizationsListData
    });
  } catch (error) {
    next(error);
  }
};

// بروزرسانی اطلاعات دستگاه
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nationalCode, organizationName, budgetRow, registerDate, registerNo, postalCode, address, parentOrganizationId, provinceId, organizationTypeId, organizationCategoryId, description } = req.body;

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
        budgetRow,
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

// تابع دریافت شماره حساب بعدی موجود
exports.getNextAvailableAccountNumber = async (req, res) => {
  try {
    const { bankId, organizationId } = req.params;

    // دریافت تمام شماره حساب‌های موجود برای این بانک و کد آنلاین
    const existingAccounts = await AccountInfoModel.findAll({
      where: {
        bankId: bankId,
        organizationId: organizationId
      },
      attributes: ['accountNumber']
    });

    // تبدیل شماره حساب‌ها به آرایه و استخراج 3 رقم آخر
    const lastThreeDigits = existingAccounts
      .map((account) => {
        const accountNumber = account.accountNumber.toString();
        return parseInt(accountNumber.slice(-3)); // تبدیل به عدد برای مقایسه
      })
      .sort((a, b) => a - b); // مرتب‌سازی اعداد

    // اگر هیچ شماره حسابی وجود نداشت
    if (lastThreeDigits.length === 0) {
      return res.json({
        success: true,
        nextNumber: '001'
      });
    }

    // پیدا کردن اولین خالی در دنباله
    let nextNumber = 1; // از 1 شروع می‌کنیم چون 001 را جداگانه چک می‌کنیم
    let foundGap = false;

    // اول چک می‌کنیم که 001 موجود هست یا نه
    if (!lastThreeDigits.includes(1)) {
      return res.json({
        success: true,
        nextNumber: '001'
      });
    }

    // جستجوی خالی در دنباله
    for (let i = 0; i < lastThreeDigits.length - 1; i++) {
      if (lastThreeDigits[i + 1] - lastThreeDigits[i] > 1) {
        nextNumber = lastThreeDigits[i] + 1;
        foundGap = true;
        break;
      }
    }

    // اگر خالی پیدا نشد، از آخرین عدد + 1 استفاده می‌کنیم
    if (!foundGap) {
      nextNumber = lastThreeDigits[lastThreeDigits.length - 1] + 1;
    }

    // اگر به 999 رسیدیم، خطا برگردانیم
    if (nextNumber > 999) {
      return res.status(400).json({
        success: false,
        message: 'ظرفیت شماره حساب‌های این دستگاه پر شده است'
      });
    }

    res.json({
      success: true,
      nextNumber: nextNumber.toString().padStart(3, '0')
    });
  } catch (error) {
    console.error('Error in getNextAvailableAccountNumber:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت شماره حساب بعدی'
    });
  }
};
