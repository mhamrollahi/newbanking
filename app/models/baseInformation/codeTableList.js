const { DataTypes } = require('sequelize');
const BaseModel = require('@models/baseModel');

class CodeTableList extends BaseModel {}

module.exports = (sequelize) => {
  CodeTableList.init(
    {
      en_TableName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args: true,
          msg: 'نام انگلیسی جدول نمی تواند تکراری باشد.'
        },
        validate: {
          notNull: {
            msg: 'لطفا نام انگلیسی جدول را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام انگلیسی جدول را وارد کنید.'
          },
          len: {
            args: [3, 50],
            msg: 'نام انگلیسی جدول  باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
          }
        }
      },

      fa_TableName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args: true,
          msg: 'نام فارسی جدول نمی تواند تکراری باشد.'
        },
        validate: {
          notNull: {
            msg: 'لطفا نام فارسی جدول را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام فارسی جدول را وارد کنید.'
          },
          len: {
            args: [3, 50],
            msg: 'نام فارسی جدول باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
          }
        }
      }
    },
    {
      sequelize,
//    tableName: 'codeTableLists',
//    freezeTableName: true,

      validate: {}
    }
  );

  CodeTableList.associate = (models) => {
    CodeTableList.hasMany(models.CodingDataModel, { foreignKey: 'codeTableListId' });
    CodeTableList.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    CodeTableList.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };

  return CodeTableList;
};
