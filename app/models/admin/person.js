const { DataTypes, } = require('sequelize');
const BaseModel = require('../baseModel');

class Person extends BaseModel {}

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

      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
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
      
      profilePicture: {
        type: DataTypes.BLOB,
        validate: {
          isFileSizeValid(value) {
            if (value && value.length > 1 * 1024 * 1024) {
              // 5MB
              throw new Error('حجم فایل عکس باید بیشتر از 1 مگابایت باشد.');
            }
          },
          isFileTypeValid(value) {
            if (value) {
              // بررسی نوع فایل (مثلاً فقط PDF)
              const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
              if (!allowedTypes.includes(value.type)) {
                throw new Error('فایل عکس باید از نوع jpeg, png, jpg باشد.');
              }
            }
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

    },
    {
      timestamps: true,
      sequelize,
      validate: {},
    }
  );

  Person.sequelize = sequelize;

  Person.associate = (models)=>{
    Person.hasMany(models.UserModel,{foreignKey:'PersonId'})
    
    Person.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    Person.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });

  }
  return Person;
};
