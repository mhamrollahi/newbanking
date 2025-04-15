const { DataTypes } = require('sequelize');
const BaseModel = require('../baseModel');

class City extends BaseModel {}

module.exports = (sequelize) => {
  City.init(
    {
      cityName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام شهر را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام شهر را وارد کنید.'
          },
          len: {
            args: [2, 50],
            msg: 'نام شهر باید بین ۲ تا 100 حرف باشد.'
          }
        }
      },

      provinceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'codingdata',
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
      //tableName: 'bankBranches',
      indexes: [
        {
          name: 'ix_cityName_provinceid',
          unique: true,
          fields: ['cityName', 'provinceId'],
          msg: 'این شهر در این استان  تکراری می‌باشد.... '
        },

      ],

      validate: {}
    }
  );

  City.sequelize = sequelize;

  City.associate = (models) => {
    City.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    City.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  };
  return City;
};
