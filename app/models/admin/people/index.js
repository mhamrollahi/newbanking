const { DataTypes } = require('sequelize');
const dateService = require('@services/dateService');

exports.Person = (sequelize) => {
  const Person = sequelize.define(
    'Person',
    {
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام کاربری همان کدملی هست.لطفا کد ملی خود را وارد کنید.'
          },
        }
      },

      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام کاربری (کد ملی) را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام کاربری همان کدملی هست.لطفا کد ملی خود را وارد کنید.'
          },
        }
      },

      nationalCode: {
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

      mobile: {
        type: DataTypes.STRING(11),
        validate: {
          isNumeric: {
            msg: 'کد ملی فقط شامل اعداد می باشد.'
          }
        }
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

  Person.beforeCreate(async (person) => {
    person.updatedAt = null;
  }),
    // استفاده از هوک برای تنظیم `updatedAt` هنگام بروزرسانی
  Person.beforeUpdate(async (person) => {
    person.updatedAt = new Date();
  });

  return Person;
};
