const { DataTypes, } = require('sequelize');
const BaseModel = require('../baseModel');

class Role extends BaseModel {}

module.exports = (sequelize) => {
  Role.init({
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام نقش کاربری را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام نقش کاربری را وارد کنید.'
          },
          len: {
            args: [2, 200],
            msg: 'نام نقش کاربری باید بین ۲ تا ۵۰ حرف باشد.'
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
      },
    },
    {
      timestamps: true,
      sequelize,
      //tableName: 'roles',
      //freezeTableName: true,

      indexes:[
        {
          name: 'ix_roleName',
          unique: true,
          fields: ['name'],
          msg: 'این نقش  تکراری می‌باشد... '
        },
      ],

      validate: {},

    }
  );

  Role.associate = (models)=>{
    Role.hasMany(models.UserRoleModel, { foreignKey: 'roleId', as: 'userRoles' });
    Role.hasMany(models.RolePermissionModel, { foreignKey: 'roleId', as: 'rolePermissions' });

    Role.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    Role.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });

  }
  return Role;
};
