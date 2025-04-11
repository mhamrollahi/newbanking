const { DataTypes } = require('sequelize');
const BaseModel = require('../baseModel');

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
            args: [2, 10],
            msg: 'کد شعبه باید بین ۲ تا 10 حرف باشد.'
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
          model: 'rolepermissions',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      contactTel: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: {
            args: [10, 20],
            msg: 'شماره تلفن باید بین 10 تا 20 حرف باشد.'
          }
        }
      },

      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
          len: {
            args: [10, 200],
            msg: 'آدرس شعبه بانک باید بین 10 تا 200 حرف باشد.'
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
        },
      ],

      validate: {}
    }
  );

  BankBranch.associate = (models) => {

    BankBranch.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    BankBranch.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return BankBranch;
};
