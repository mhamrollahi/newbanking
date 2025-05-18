const { DataTypes } = require('sequelize');
const BaseModel = require('@models/baseModel');

class AccountInfo extends BaseModel {}

module.exports = (sequelize) => {
  AccountInfo.init(
    {
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

      accountTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا  عنوان حساب را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا  عنوان حساب را وارد کنید.'
          }
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
          }
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
          }
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
          }
        }
      },

      accountTypeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codingdata',
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
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
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

      transferPeriodId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'codingdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      // وضعیت حساب: مسدود / غیرمسدود
      obstructStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      // وضعیت حساب: باز / بسته
      accountStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      requestObstructNo: {
        type: DataTypes.STRING(20)
      },

      requestObstructDate: {
        type: DataTypes.DATE
      },

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
          name: 'ix_accountNumber',
          unique: true,
          fields: ['accountNumber'],
          msg: 'این شماره حساب  تکراری می‌باشد.... '
        }
      ],

      validate: {}
    }
  );

  AccountInfo.sequelize = sequelize;

  AccountInfo.associate = (models) => {
    AccountInfo.belongsTo(models.CodingDataModel, { foreignKey: 'accountTypeId', as: 'accountType' });
    AccountInfo.belongsTo(models.CodingDataModel, { foreignKey: 'provinceId', as: 'province' });
    AccountInfo.belongsTo(models.CodingDataModel, { foreignKey: 'transferPeriodId', as: 'transferPeriod' });
    AccountInfo.belongsTo(models.BankBranchModel, { foreignKey: 'bankBranchId', as: 'bankBranch' });
    AccountInfo.belongsTo(models.CodeOnlineModel, { foreignKey: 'codeOnlineId', as: 'codeOnline' });
    AccountInfo.belongsTo(models.OrganizationMasterDataModel, { foreignKey: 'organizationId', as: 'organization' });

    AccountInfo.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    AccountInfo.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };

  return AccountInfo;
};
