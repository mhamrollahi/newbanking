const { DataTypes } = require('sequelize');
const hashService = require('@services/hashService');
const BaseModel = require('@models/baseModel');

class User extends BaseModel {}
module.exports = (sequelize) => {
  User.init(
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

      PersonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Person',
          key: 'id'
        }
      },

      // fullName: {
      //   type: DataTypes.STRING(50),
      //   allowNull: false,
      //   unique: {
      //     args: true,
      //     msg: 'نام و نام‌خانوادگی نمی تواند تکراری باشد.'
      //   },
      //   validate: {
      //     notNull: {
      //       msg: 'لطفا نام و نام‌خانوادگی را وارد کنید.'
      //     },
      //     notEmpty: {
      //       msg: 'لطفا نام و نام‌خانوادگی را وارد کنید.'
      //     },
      //     len: {
      //       args: [5, 50],
      //       msg: 'نام و نام‌خانوادگی  باید  بین 5 تا 50 کاراکتر باشد.'
      //     }
      //   }
      // },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },

      Description: {
        type: DataTypes.STRING(255)
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
    //    user.updatedAt = null;
  });

  User.beforeUpdate(async (user) => {
    //  user.updatedAt = new Date();

    if (user.changed('password')) {
      user.password = await hashService.hashPassword(user.password);
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.PersonModel, {
      foreignKey: {
        name: 'PersonId',
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        as: 'person'
      }
    });
  };

  User.associate = (models) => {
    User.hasMany(models.CodeTableListModel, { foreignKey: 'creatorId' });
    User.hasMany(models.CodeTableListModel, { foreignKey: 'updaterId' });

    User.hasMany(models.CodingDataModel, { foreignKey: 'creatorId' });
    User.hasMany(models.CodingDataModel, { foreignKey: 'updaterId' });

    User.hasMany(models.PersonModel, { foreignKey: 'creatorId' });
    User.hasMany(models.PersonModel, { foreignKey: 'updaterId' });
  };

  return User;
};
