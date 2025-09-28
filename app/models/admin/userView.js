const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserView = sequelize.define(
    'UserView',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(11),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false, 
        defaultValue: 1
      },
      profilePicture: {
        type: DataTypes.STRING(100),
        allowNull: true,
      }
    },
    {
      tableName: 'vw_users',
      timestamps: false,
      freezeTableName: true
    }
  );

  UserView.associate = (models) => {

    UserView.hasMany(models.CodeTableListModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.CodeTableListModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.CodingDataModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.CodingDataModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.PersonModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.PersonModel, { foreignKey: 'updaterId' });
    
    UserView.hasMany(models.PermissionModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.PermissionModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.RoleModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.RoleModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.UserRoleModel, { foreignKey: 'creatorId' ,as:'creator'});
    UserView.hasMany(models.UserRoleModel, { foreignKey: 'updaterId',as:'updater'});
    UserView.hasMany(models.UserRoleModel, { foreignKey: 'userId',as: 'userRoles' });

    UserView.hasMany(models.RolePermissionModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.RolePermissionModel, { foreignKey: 'updaterId' });


  };

  return UserView;
};
