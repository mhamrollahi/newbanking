const { DataTypes } = require('sequelize');
const dateService = require('@services/dateService');
const hashService = require('@services/hashService');

exports.User = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: {
          args: true,
          msg: 'نام کاربری (کد ملی) نمی تواند تکراری باشد.'
        },
        validate: {
          notNull: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          len: {
            args: [10, 10],
            msg: 'نام کاربری همان کدملی هست.لطفا کد ملی خود را وارد کنید.'
          },
          isNumeric: {
            msg: 'کد ملی فقط شامل اعداد می باشد.'
          }
        }
      },

      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,20}$/, // حداقل یک عدد، یک حرف خاص و یک حرف
            msg: 'رمز عبور باید حداقل شامل یک عدد، یک کاراکتر خاص (!@#$%^&*) و حروف باشد و حداقل ۶ کاراکتر داشته باشد.'
          },
          notNull: {
            msg: 'لطفا کلمه عبور را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا کلمه عبور را وارد کنید.'
          }
        }
      },

      fullName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args: true,
          msg: 'نام و نام‌خانوادگی نمی تواند تکراری باشد.'
        },
        validate: {
          notNull: {
            msg: 'لطفا نام و نام‌خانوادگی را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام و نام‌خانوادگی را وارد کنید.'
          },
          len: {
            args: [5, 50],
            msg: 'نام و نام‌خانوادگی  باید  بین 5 تا 50 کاراکتر باشد.'
          }
        }
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },

      Description: {
        type: DataTypes.STRING(255)
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

  User.beforeCreate(async (user) => {
    user.password = await hashService.hashPassword(user.password);
    user.updatedAt = null;
  }),
    // استفاده از هوک برای تنظیم `updatedAt` هنگام بروزرسانی
    User.beforeUpdate(async (user) => {
      user.updatedAt = new Date();

      if (user.changed('password')) {
        user.password = await hashService.hashPassword(user.password);
      }
    });

  return User;
};
