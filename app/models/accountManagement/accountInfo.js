const { DataTypes } = require('sequelize');
const BaseModel = require('@models/baseModel');
const dateService = require('@services/dateService');

class AccountInfo  extends BaseModel {}

module.exports = (sequelize) => {
  AccountInfo.init(
    {

      // فیلدهای جدید
      accountNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notNull: {  
            msg: 'لطفا  شماره حساب را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  شماره حساب را وارد کنید.'
          },
          len: {
            args: [1, 20],
            msg: 'شماره حساب باید بین 1 تا 20 حرف باشد.'
          },
          isNumericOrPersian(value) {
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }
            if (!/^\d+$/.test(convertedValue)) {
              throw new Error('شماره حساب باید فقط شامل اعداد باشد .');
            }
          } 
        }
      },

      accountTitle : {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  عنوان حساب را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  عنوان حساب را وارد کنید.'
          },
          
        }
      },

      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'organizationMasterData',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      codeOnlineId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codeOnline',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },
      
      openDate: {
        type: DataTypes.DATE,
        validate: {
          notNull: {
            msg: 'لطفا  تاریخ باز شدن حساب را وارد کنید.' 
          },
          notEmpty: {
            msg: 'لطفا  تاریخ باز شدن حساب را وارد کنید.'
          },
          
        }
      },
      
      requestLetterDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  تاریخ نامه درخواست حساب را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  تاریخ نامه درخواست حساب را وارد کنید.'
          },
          
        }
      },

      requestLetterNo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  شماره نامه درخواست حساب را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  شماره نامه درخواست حساب را وارد کنید.'
          },
          
        }
      },

      accountTypeId: {
        type: DataTypes.INTEGER,
        references: {
          model: '  ',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      bankBranchId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'bankBranch',
          key: 'id'
        },
      },
      obstructStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // فیلدهای قدیمی
      nationalCode: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  شناسه ملی را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  شناسه ملی را وارد کنید.'
          },
          len: {
            args: [11, 11],
            msg: ' شناسه ملی باید بین 0 تا ۲۰ حرف باشد.'
          },
          isNumericOrPersian(value) {
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }

            // بررسی اینکه آیا همه کاراکترها عدد هستند
            if (!/^\d+$/.test(convertedValue)) {
              throw new Error('شناسه ملی  باید فقط شامل اعداد باشد 111.');
            }
          }
        }
      },

      organizationName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا عنوان دستگاه را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا عنوان دستگاه را وارد کنید.'
          },
          len: {
            args: [1, 200],
            msg: 'عنوان دستگاه باید بین 1 تا 200 حرف باشد.'
          }
        }
      },

      budgetRow: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  ردیف بودجه را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  ردیف بودجه را وارد کنید.'
          },
          len: {
            args: [8, 8],
            msg: 'ردیف بودجه باید 8 رقم باشد.'
          },
          isNumericOrPersian(value) {
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }

            // بررسی اینکه آیا همه کاراکترها عدد هستند
            if (!/^\d+$/.test(convertedValue)) {
              throw new Error('شناسه ملی  باید فقط شامل اعداد باشد 111.');
            }
          }
        }
      },

      registerDate: {
        type: DataTypes.DATE,
        get() {
          const rawValue = this.getDataValue('registerDate');
          if (!rawValue) return null;
          // Convert Date to string and format it as YYYY/MM/DD
          const dateStr = rawValue.toISOString().split('T')[0];
          return dateStr.replace(/-/g, '/');
        },
        set(value) {
          console.log('Setting date value:', value);
          if (!value) {
            this.setDataValue('registerDate', null);
            return;
          }
          const gregorianDate = dateService.toEnglishDate(value);
          console.log('Converted to Gregorian:', gregorianDate);
          this.setDataValue('registerDate', gregorianDate);
        }
      },

      registerNo: {
        type: DataTypes.STRING(10),
        validate: {
          len: {
            args: [0, 10],
            msg: 'شماره ثبت باید بین 0 تا 10 حرف باشد.'
          },

          isNumericOrPersian(value) {
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }

            // بررسی اینکه آیا همه کاراکترها عدد هستند
            if (!/^\d+$/.test(convertedValue)) {
              throw new Error('شماره ثبت باید فقط شامل اعداد باشد 111.');
            }
          }
        }
      },

      postalCode: {
        type: DataTypes.STRING(10),
        validate: {
          len: {
            args: [0, 10],
            msg: 'کد پستی باید بین 10 عدد باشد.'
          },
          isNumericOrPersian(value) {
            if (!value || value.trim() === '') return; // اگر مقدار خالی باشد، اجازه می‌دهیم
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }

            // بررسی اینکه آیا همه کاراکترها عدد هستند
            if (!/^\d+$/.test(convertedValue)) {
              throw new Error('شماره تلفن باید فقط شامل اعداد باشد.');
            }
          }
        }
      },

      address: {
        type: DataTypes.STRING(200),
        validate: {
          len: {
            args: [0, 200],
            msg: 'آدرس دستگاه باید بین 0 تا 200 حرف باشد.'
          }
        }
      },

      provinceId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codingdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },


      //جنس دستگاه
      organizationTypeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codingdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      //نوع دستگاه
      organizationCategoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codingdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      // filePathStatute: {
      //   type: DataTypes.BLOB,
      //   validate: {
      //     isFileSizeValid(value) {
      //       if (value && value.length > 5 * 1024 * 1024) {
      //         // 5MB
      //         throw new Error('حجم فایل اساسنامه نباید بیشتر از 5 مگابایت باشد.');
      //       }
      //     },
      //     isFileTypeValid(value) {
      //       if (value) {
      //         // بررسی نوع فایل (مثلاً فقط PDF)
      //         const allowedTypes = ['application/pdf'];
      //         if (!allowedTypes.includes(value.type)) {
      //           throw new Error('فایل اساسنامه باید از نوع PDF باشد.');
      //         }
      //       }
      //     }
      //   }
      // },

      // filePathFinancial: {
      //   type: DataTypes.BLOB,
      //   validate: {
      //     isFileSizeValid(value) {
      //       if (value && value.length > 5 * 1024 * 1024) {
      //         // 5MB
      //         throw new Error('حجم فایل مالی نباید بیشتر از 5 مگابایت باشد.');
      //       }
      //     },
      //     isFileTypeValid(value) {
      //       if (value) {
      //         const allowedTypes = ['application/pdf'];
      //         if (!allowedTypes.includes(value.type)) {
      //           throw new Error('فایل مالی باید از نوع PDF باشد.');
      //         }
      //       }
      //     }
      //   }
      // },

      // filePathFoundationAd: {
      //   type: DataTypes.BLOB,
      //   validate: {
      //     isFileSizeValid(value) {
      //       if (value && value.length > 5 * 1024 * 1024) {
      //         // 5MB
      //         throw new Error('حجم فایل آگهی تأسیس نباید بیشتر از 5 مگابایت باشد.');
      //       }
      //     },
      //     isFileTypeValid(value) {
      //       if (value) {
      //         const allowedTypes = ['application/pdf'];
      //         if (!allowedTypes.includes(value.type)) {
      //           throw new Error('فایل آگهی تأسیس باید از نوع PDF باشد.');
      //         }
      //       }
      //     }
      //   }
      // },

      // isConfirmed: {
      //   type: DataTypes.BOOLEAN
      // },

      description: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 255],
            msg: 'توضیحات باید کمتر از ۲۵۵ کاراکتر باشد.'
          }
        }
      }
    },
    {
      timestamps: true,
      sequelize,
      indexes: [
        {
          name: 'ix_provinceId,nationalCode',
          unique: true,
          fields: ['provinceId', 'nationalCode'],
          msg: 'این شناسه ملی در این استان  تکراری می‌باشد.... '
        }
      ],

      validate: {}
    }
  );

  AccountInfo.sequelize = sequelize;

  AccountInfo.associate = (models) => {
    AccountInfo.belongsTo(models.CodingDataModel, { foreignKey: 'provinceId', as: 'province' });
    OrganizationMasterData.belongsTo(models.CodingDataModel, { foreignKey: 'organizationTypeId', as: 'organizationType' });
    OrganizationMasterData.belongsTo(models.CodingDataModel, { foreignKey: 'organizationCategoryId', as: 'organizationCategory' });
    OrganizationMasterData.belongsTo(models.OrganizationMasterDataModel, { foreignKey: 'parentOrganizationId', as: 'parentOrganization' });
    
    
    OrganizationMasterData.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    OrganizationMasterData.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });



    // OrganizationMasterData.hasMany(models.OrganizationMasterDataModel, {
    //   foreignKey: 'parentOrganizationId',
    //   as: 'childrenOrganizations'
    // });
  };

  return  AccountInfo;
};
