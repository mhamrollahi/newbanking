const { DataTypes } = require('sequelize');
const BaseModel = require('@models/baseModel');

class CodeOnline extends BaseModel {}

module.exports = (sequelize) => {
  CodeOnline.init(
    {
      code: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا کد آنلاین را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا کد آنلاین را وارد کنید.'
          },
          len: {
            args: [1, 4],
            msg: 'کد آنلاین باید بین ۱ تا ۴ کاراکتر باشد.'
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
              throw new Error('کد آنلاین  باید فقط شامل اعداد باشد .');
            }
          },
          set(value) {
            // تبدیل اعداد فارسی به انگلیسی
            const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
            const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let convertedValue = value;
            for (let i = 0; i < 10; i++) {
              convertedValue = convertedValue.replace(persianNumbers[i], englishNumbers[i]);
            }
            // اضافه کردن صفر به انتهای مقدار تا ۴ رقم شود
            if (convertedValue.length < 4) {
              convertedValue =  '0'.repeat(4 - convertedValue.length) + convertedValue;
            }
            this.setDataValue('code', convertedValue);
          },

        }
      },

      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'organizationmasterdata',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
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
          name: 'ix_onlineCode',
          unique: true,
          fields: ['code'],
          msg: 'این کد آنلاین  تکراری می‌باشد.... '
        },
        {
          name: 'ix_organizationId',
          unique: true,
          fields: ['organizationId'],
          msg: 'این کد آنلاین برای این سازمان  تکراری می‌باشد.... '
        }
      ],

      validate: {}
    }
  );

  CodeOnline.sequelize = sequelize;

  CodeOnline.associate = (models) => {
    CodeOnline.belongsTo(models.OrganizationMasterDataModel, { foreignKey: 'organizationId', as: 'organization' });

    CodeOnline.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    CodeOnline.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return CodeOnline;
};
