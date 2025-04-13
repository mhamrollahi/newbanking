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
        unique: {
          args: true,
          msg: 'نام و نام‌خانوادگی نمی تواند تکراری باشد.'
        },

        references: {
          model: 'Person',
          key: 'id'
        }
      },

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
      tableName: 'user',
      freezeTableName: true,

      validate: {},

      indexes: [
        {
          unique: true,
          fields: ['PersonId'],
          name: 'ix_Users_PersonId',
          msg: 'برای این نام و نام‌خانوادگی نام کاربری قبلاً ثبت شده است'
        }
      ]
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
      foreignKey: 'PersonId',
      allowNull: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      as: 'person'
    });

    User.hasMany(models.CodeTableListModel, { foreignKey: 'creatorId' });
    User.hasMany(models.CodeTableListModel, { foreignKey: 'updaterId' });

    User.hasMany(models.CodingDataModel, { foreignKey: 'creatorId' });
    User.hasMany(models.CodingDataModel, { foreignKey: 'updaterId' });

    User.hasMany(models.PersonModel, { foreignKey: 'creatorId' });
    User.hasMany(models.PersonModel, { foreignKey: 'updaterId' });

    User.hasMany(models.PermissionModel, { foreignKey: 'creatorId' });
    User.hasMany(models.PermissionModel, { foreignKey: 'updaterId' });

    User.hasMany(models.RoleModel, { foreignKey: 'creatorId' });
    User.hasMany(models.RoleModel, { foreignKey: 'updaterId' });

    User.hasMany(models.UserRoleModel, { foreignKey: 'creatorId' });
    User.hasMany(models.UserRoleModel, { foreignKey: 'updaterId' });
    User.hasMany(models.UserRoleModel, { foreignKey: 'userId', as: 'userRoles' });

    User.hasMany(models.RolePermissionModel, { foreignKey: 'creatorId' });
    User.hasMany(models.RolePermissionModel, { foreignKey: 'updaterId' });

    // User.hasMany(models.BankBranchModel, { foreignKey: 'creatorId' });
    // User.hasMany(models.BankBranchModel, { foreignKey: 'updaterId' });

  };

  return User;
};
