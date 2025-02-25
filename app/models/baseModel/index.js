const { Model, DataTypes } = require('sequelize');

class BaseModel extends Model {
  static init(attributes, options) {
    const commonFields = {
      creator: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },

      updater: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      }
    };

    return super.init(
      { ...attributes, ...commonFields },
      {
        ...options,
        timestamps: true,
        hooks: {
          beforeCreate: (instance, options) => {
            if (options.userId) {
              instance.creator = options.userId;
            }
          },
          beforeUpdate: (instance, options) => {
            if (options.userId) {
              instance.updater = options.userId;
            }
          }
        }
      }
    );
  }
}

module.exports = BaseModel;
