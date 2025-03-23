const { DataTypes } = require('sequelize');
const BaseModel = require('../baseModel');

class UserRole extends BaseModel {}

module.exports = (sequelize) => {
  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

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

      description: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 255],
            msg: 'توضیحات باید کمتر از ۲۵۵ کاراکتر باشد.'
          }
        }
      }
    },
    {
      timestamps: true,
      sequelize,
      validate: {}
    }
  );

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.RoleModel, { foreignKey: 'roleId', as: 'role' });
    UserRole.belongsTo(models.UserModel, { foreignKey: 'userId', as: 'user' });

    UserRole.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    UserRole.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return UserRole;
};
