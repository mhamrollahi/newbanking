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
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false, 
        defaultValue: 1
      }
    },
    {
      tableName: 'vw_users',
      timestamps: false,
      freezeTableName: true
    }
  );

  UserView.associate = (models) => {
  //   UserView.belongsTo(models.PersonModel, {
  //     foreignKey: 'PersonId',
  //     allowNull: false,
  //     onDelete: 'RESTRICT',
  //     onUpdate: 'RESTRICT',
  //     as: 'person'
  //   });

    UserView.hasMany(models.CodeTableListModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.CodeTableListModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.CodingDataModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.CodingDataModel, { foreignKey: 'updaterId' });

    UserView.hasMany(models.PersonModel, { foreignKey: 'creatorId' });
    UserView.hasMany(models.PersonModel, { foreignKey: 'updaterId' });
  };

  return UserView;
};
