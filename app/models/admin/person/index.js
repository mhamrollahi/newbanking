const { DataTypes, Model } = require('sequelize');
const dateService = require('@services/dateService');

class Person extends Model {}

module.exports = (sequelize) => {
  Person.init({
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام خود را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام خود را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام باید بین ۲ تا ۵۰ حرف باشد.'
          }
        }
      },

      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام خانوادگی را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام خانوادگی را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام خانوادگی باید بین ۲ تا ۵۰ حرف باشد.'
          }
        }
      },

      nationalCode: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: {
          args: true,
          msg: 'کدملی نمی تواند تکراری باشد.'
        },
        validate: {
          notNull: {
            msg: 'کدملی را وارد کنید.'
          },
          notEmpty: {
            msg: 'کدملی را وارد کنید.'
          },
          len: {
            args: [10, 10],
            msg: 'کد ملی معتبر نمی‌باشد.'
          },
          isNumeric: {
            msg: 'کد ملی فقط شامل عدد می باشد.'
          }
        }
      },

      mobile: {
        type: DataTypes.STRING(11),
        validate: {
          is: {
            args: /^09[0-9]{9}$/,
            msg: 'شماره موبایل معتبر نمی باشد.'
          },
          isNumeric: {
            msg: 'شماره موبایل فقط شامل اعداد می باشد.'
          },
          len: {
            args: [11, 11],
            msg: 'شماره موبایل معتبر نمی‌باشد.'
          }
        }
      },

      Description: {
        type: DataTypes.STRING(255),
        validate: {
          len: {
            args: [0, 255],
            msg: 'توضیحات باید کمتر از ۲۵۵ کاراکتر باشد.'
          }
        }
      },

      creator: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام ایجاد کننده را وارد کنید.'
          }
        }
      },

      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: null
      },

      updater: {
        type: DataTypes.STRING(50)
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
      timestamps: true,
      sequelize,
      validate: {}
    }
  );

  Person.beforeCreate(async (person) => {
    person.updatedAt = null;
  });
  // استفاده از هوک برای تنظیم `updatedAt` هنگام بروزرسانی
  Person.beforeUpdate(async (person) => {
    person.updatedAt = new Date();
  });

  Person.associate = (models)=>{
    Person.hasMany(models.UserModel,{foreignKey:'PersonId'})
  }
  return Person;
};
