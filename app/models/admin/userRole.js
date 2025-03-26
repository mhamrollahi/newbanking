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
      indexes:[
        {
          name: 'ix_userId_roleId',
          unique: true,
          fields: ['userId', 'roleId'],
          msg: 'این نقش برای این کاربر تکراری می‌باشد.... '
        }
      ],

      validate: {}
    }
  );

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.RoleModel, { foreignKey: 'roleId', as: 'roles' });
    UserRole.belongsTo(models.UserModel, { foreignKey: 'userId', as: 'users' });
    UserRole.belongsTo(models.UserViewModel, { foreignKey: 'userId', as: 'usersView' });

    UserRole.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    UserRole.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return UserRole;
};
