const { Model, DataTypes } = require('sequelize');
const dateService = require('@services/dateService');

class BaseModel extends Model {
  static init(attributes, options) {
    const commonFields = {
      
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      updaterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      updatedAt:{
        type:DataTypes.DATE,
        default:null
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
    };

    // return super.init({ ...attributes, ...commonFields }, options);

    return super.init(
      { ...attributes, ...commonFields },
      {
        ...options,
        timestamps: true,
        hooks: {
          beforeCreate: (instance, options) => {
            if (options.userId) {
              instance.creatorId = options.userId;
              instance.updatedAt = null;
            }
          },
          beforeUpdate: (instance, options) => {
            if (options.userId) {
              instance.updaterId = options.userId;
              instance.updatedAt = new Date();
            }
          }
        }
      }
    );
  }
  
  static associate(models){
    this.belongsTo(models.User,{foreignKey:'creatorId',as:'creator'})
    this.belongsTo(models.User,{foreignKey: 'updaterId',as: 'updater'})
  }
}

module.exports = BaseModel;
