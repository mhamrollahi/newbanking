const { DataTypes } = require('sequelize');
const BaseModel = require('../../baseModel');

class BankBranch extends BaseModel {}

module.exports = (sequelize) => {
  BankBranch.init(
    {
      branchName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام شعبه را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام شعبه را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام شعبه باید بین ۲ تا ۵۰ حرف باشد.'
          }
        }
      },

      branchCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا کد شعبه را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا کد شعبه را وارد کنید.'
          },
          len: {
            args: [1, 10],
            msg: 'کد شعبه باید بین 1 تا 10 عدد باشد.'
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
              throw new Error('کد شعبه شعبه شعبه باید فقط شامل اعداد باشد 111.');
            }
          }
        }
      },

      bankId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'codingdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      contactTel: {
        type: DataTypes.STRING(20),
        validate: {
          len: {
            args: [0, 20],
            msg: 'شماره تلفن باید بین 0 تا 20 حرف باشد.'
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
            msg: 'آدرس شعبه بانک باید بین 0 تا 200 حرف باشد.'
          }
        }
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
          name: 'ix_branchCode,bankId',
          unique: true,
          fields: ['branchCode', 'bankId'],
          msg: 'این کدشعبه در این بانک  تکراری می‌باشد.... '
        },
        {
          name: 'ix_branchName,bankId',
          unique: true,
          fields: ['branchName', 'bankId'],
          msg: 'این نام شعبه برای این بانک تکراری می‌باشد.... '
        }
      ],

      validate: {}
    }
  );

  BankBranch.sequelize = sequelize;

  BankBranch.associate = (models) => {
    BankBranch.belongsTo(models.CodingDataModel, { foreignKey: 'bankId', as: 'bank' });
    BankBranch.belongsTo(models.CityModel, { foreignKey: 'cityId', as: 'city' });

    BankBranch.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    BankBranch.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return BankBranch;
};
