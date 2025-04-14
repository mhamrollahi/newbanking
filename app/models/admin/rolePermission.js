const { DataTypes, } = require('sequelize');
const BaseModel = require('../baseModel');

class RolePermission extends BaseModel {}

module.exports = (sequelize) => {
  RolePermission.init({

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'
    },

    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id'
      },
      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT'
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
      //tableName: 'rolePermissions',
      //freezeTableName: true,

      indexes:[
        {
          name: 'ix_roleId_permissionId',
          unique: true,
          fields: ['roleId', 'permissionId'],
          msg: 'این مجوز برای این نقش تکراری می‌باشد.... '
        }
      ],
      validate: {},

    }
  );

  RolePermission.associate = (models)=>{

    RolePermission.belongsTo(models.RoleModel, { foreignKey: 'roleId', as: 'roles' });
    RolePermission.belongsTo(models.PermissionModel, { foreignKey: 'permissionId', as: 'permissions' });

    RolePermission.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    RolePermission.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });

  }
  return RolePermission;
};
