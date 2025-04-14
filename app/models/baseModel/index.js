const { Model, DataTypes } = require('sequelize');
const db = require('../../../database/mysql');
// const CodingDataModel  = require('../baseInformation/codingData');
// const CodeTableListModel  = require('../baseInformation/codeTableList');
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

    const defaultHooks = {
      afterInit: async (model) => {
        console.log('✅ afterInit executed for:', model.name);
        await model.createPermissions?.(); // مطمئن شو این متد تو کلاس هست
      },
      beforeCreate: (instance, options) => {
        if (options.userId) instance.creatorId = options.userId;
        instance.updatedAt = null;
      },
      beforeUpdate: (instance, options) => {
        if (options.userId) instance.updaterId = options.userId;
        instance.updatedAt = new Date();
      }
    };

    const mergedHooks = {
      ...defaultHooks,
      ...(options?.hooks || {})
    };

    return super.init(
      { ...attributes, ...commonFields },
      {
        ...options,
        hooks: mergedHooks,
        timestamps: true
      }
    );
  }

  // return super.init(
  //   { ...attributes, ...commonFields },
  //   {
  //     ...options,
  //     timestamps: true,
  //     hooks: {

  //       afterInit: async(model) =>{
  //         await model.createPermissions()
  //       },

  //       beforeCreate: (instance, options) => {
  //         if (options.userId) {
  //           instance.creatorId = options.userId;
  //         }
  //         instance.updatedAt = null;
  //       },
  //       beforeUpdate: (instance, options) => {
  //         if (options.userId) {
  //           instance.updaterId = options.userId;
  //         }
  //         instance.updatedAt = new Date();
  //       },
  //     }
  //   }
  // );
  // }

  static associate(models) {
    this.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    this.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });
  }

  static async createPermissions(models) {
    const CodingDataModel = models.CodingDataModel;
    const CodeTableListModel = models.CodeTableListModel;

    const actionListData = await CodingDataModel.findAll({
      attributes:['id','title'],
      include: [{
        model: CodeTableListModel,
        where: {en_TableName: coding.CODING_Action_Permission}
      }],
    })


    for (const action of actionListData) {
      console.log(`action.id: ${action.id}, action.name: ${action.title}, permission name: ${this.getTableName().toLowerCase()} - ${action.title.toLowerCase()} , entity_type: ${this.getTableName().toLowerCase()}`);
      await models.PermissionModel.findOrCreate({
        where: {
          actionId: action.id, 
          //entity_type: this.name.toLowerCase()
          entity_type: this.getTableName().toLowerCase()
        }, 
        defaults: {
          name: `${this.getTableName().toLowerCase()}_${action.title.toLowerCase()}`, 
          creatorId: 1,// Admin user id
        }
      });
    }
  }
}

module.exports = BaseModel;
