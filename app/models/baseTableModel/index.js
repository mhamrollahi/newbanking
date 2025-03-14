const { DataTypes } = require('sequelize');
const BaseModel = require('@models/baseModel');

class BaseTableModel extends BaseModel {
  static init(attributes, options) {
    // Common validation messages
    const commonValidationMessages = {
      notNull: 'لطفا {field} را وارد کنید.',
      notEmpty: 'لطفا {field} را وارد کنید.',
      unique: '{field} نمی تواند تکراری باشد.',
      len: '{field} باید کلمه‌ای بین {min} تا {max} کاراکتر باشد.'
    };

    // Common string field options
    const getCommonStringField = (fieldName, min = 3, max = 50, isUnique = false) => ({
      type: DataTypes.STRING(max),
      allowNull: false,
      ...(isUnique && {
        unique: {
          args: true,
          msg: commonValidationMessages.unique.replace('{field}', fieldName)
        }
      }),
      validate: {
        notNull: {
          msg: commonValidationMessages.notNull.replace('{field}', fieldName)
        },
        notEmpty: {
          msg: commonValidationMessages.notEmpty.replace('{field}', fieldName)
        },
        len: {
          args: [min, max],
          msg: commonValidationMessages.len
            .replace('{field}', fieldName)
            .replace('{min}', min)
            .replace('{max}', max)
        }
      }
    });

    // Common fields that most tables will have
    const commonFields = {
      en_TableName: getCommonStringField('نام انگلیسی جدول', 3, 50, true),
      fa_TableName: getCommonStringField('نام فارسی جدول', 3, 50, true),
      Description: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    };

    // Merge provided attributes with common fields
    const mergedAttributes = {
      ...commonFields,
      ...attributes
    };

    // Call parent's init with merged attributes
    return super.init(mergedAttributes, {
      ...options,
      validate: {}
    });
  }

  static associate(models) {
    // Call parent's associate method
    super.associate(models);

    // Add any common associations here
    if (models.CodingDataModel) {
      this.hasMany(models.CodingDataModel, { foreignKey: 'codeTableListId' });
    }
  }
}

module.exports = BaseTableModel; 