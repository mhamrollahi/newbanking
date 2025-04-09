const { Model, DataTypes } = require('sequelize');
const db  = require('../../../database/mysql');
const CodingDataModel  = require('../baseInformation/codingData');
const CodeTableListModel  = require('../baseInformation/codeTableList');
const coding = require('@constants/codingDataTables.js');

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

      updatedAt: {
        type: DataTypes.DATE,
        default: null
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
    
    return super.init(
      { ...attributes, ...commonFields },
      {
        ...options,
        timestamps: true,
        hooks: {
          beforeCreate: (instance, options) => {
            if (options.userId) {
              instance.creatorId = options.userId;
            }
            instance.updatedAt = null;
          },
          beforeUpdate: (instance, options) => {
            if (options.userId) {
              instance.updaterId = options.userId;
            }
            instance.updatedAt = new Date();
          },
          afterInit: async(model) =>{
            await model.createPermissions()
          }
        }
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    this.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  }

  static async createPermissions() {
    const actionListData = await CodingDataModel.findAll({ 
      attributes:['id','title'],
      include: [{
        model: CodeTableListModel,
        where: {en_TableName: coding.CODING_Action_Permission}
      }],
    })

  for(const action of actionListData){
    await db.query(`INSERT INTO permissions (actionId,entity_name,name,creatorId) 
      VALUES (${action.id},'${this.name.toLowerCase()}','${this.name.toLowerCase()}_${action.title.toLowerCase()}',1`)} 
  }

}

module.exports = BaseModel;
