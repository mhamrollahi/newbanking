const { DataTypes, Model } = require('sequelize');
const dateService = require('@services/dateService');
// const BaseModel = require('@models/baseModel');

class CodingData extends Model {}

module.exports = (sequelize) => {
  CodingData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
        validate: {
          // validation رو برای id برداریم
          notNull: false
        }
      },

      codeTableListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'CodeTableLists',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          name: 'ix_CodeTableListId_Title',
          args: true,
          msg: 'این عنوان در این کدینگ  تکراری می‌باشد.... '
        },
        validate: {
          notNull: {
            msg: 'لطفا نام کدینگ جدول را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام کدینگ جدول را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام کدینگ جدول  باید کلمه‌ای بین 2 تا 50 کاراکتر باشد.'
          }
        }
      },

      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        get() {
          const value = this.getDataValue('description');
          return value === null ? '' : value;
        },
        defaultValue: null,
        validate: {
          len: {
            args: [4, 250],
            msg: 'توضیحات می‌بایست بین 4 تا 255 حرف باشد.'
          }
        }
      },

      sortId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // unique: {
        //   args:true,
        //   msg: 'کد نمی تواند تکراری باشد.'
        // },
        validate: {
          notNull: {
            msg: 'لطفا مرتبه کدینگ جدول را وارد کنید.'
          },
          isNumeric: {
            msg: 'کد فقط باید عدد باشد.'
          },
          min: {
            args: 1,
            msg: 'مرتبه کدینگ عددی بین 1 تا 99 می باشد.'
          },
          max: {
            args: 99,
            msg: 'مرتبه کدینگ عددی بین 1 تا 99 می باشد.'
          }
        }
      },

      refId: {
        type: DataTypes.STRING(4),
        allowNull: true,
        defaultValue: null,
        get() {
          const value = this.getDataValue('refId');
          return value === null ? '' : value;
        },
        validate: {
          len: {
            args: [1, 4],
            msg: 'کد ثانویه کدی  بین 1 تا 4 حرف  می‌باشد.'
          }
        }
      },

      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      updaterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      updatedAt: {
        type: DataTypes.DATE,
        default: null
      },

      fa_createdAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue('createdAt');
          return dateService.toPersianDate(rawValue);
        }
      },

      fa_updatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue('updatedAt');
          return dateService.toPersianDate(rawValue);
        }
      }
    },
    {
      // freezeTableName: true, // جلوگیری از تغییرات غیرمنتظره روی جدول
      sequelize,
      indexes: [
        {
          name: 'ix_CodeTableListId_Title',
          unique: true,
          fields: ['CodeTableListId', 'title'],
          msg: 'این عنوان در این کدینگ  تکراری می‌باشد.... '
        }
      ],
      validate: {},
      hooks: {
        beforeValidate: async function (record, options) {
          console.log('Starting beforeValidate hook in CodingData', record, options);
          try {
            if (!record.id) {
              const lastRecord = await CodingData.findOne({
                where: { codeTableListId: record.codeTableListId },
                order: [['id', 'desc']]
              });
              const lastId = lastRecord ? lastRecord.id : record.codeTableListId * 1000;
              record.id = lastId + 1;
              console.log('Generated ID:', record.id);
            }
          } catch (error) {
            console.error('Error in beforeValidate hook:', error);
            throw error; // مهمه که error رو throw کنیم
          }
        },
        // هوک‌های BaseModel رو هم اضافه می‌کنیم
        beforeCreate: (instance, options) => {
          if (options.userId) {
            instance.creatorId = options.userId;
          }
          instance.updatedAt = null;
        },
        beforeUpdate: (instance, options) => {
          if (options.userId) {
            instance.updaterId = options.userId;
          }
          instance.updatedAt = new Date();
        }
    }
    }
  );

  CodingData.associate = (models) => {
    CodingData.belongsTo(models.CodeTableListModel, {
      foreignKey: {
        name: 'codeTableListId',
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    });
    CodingData.belongsTo(models.UserModel, { foreignKey: 'creatorId', as: 'creator' });
    CodingData.belongsTo(models.UserModel, { foreignKey: 'updaterId', as: 'updater' });

  };

  return CodingData;
};
