const { DataTypes, } = require('sequelize');
const BaseModel = require('../baseModel');

class Permission extends BaseModel {}

module.exports = (sequelize) => {
  Permission.init({
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام مجوز را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام مجوز را وارد کنید.'
          },
          len: {
            args: [2, 200],
            msg: 'نام مجوز باید بین ۲ تا ۵۰ حرف باشد.'
          }
        }
      },

      entity_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'لطفا نام جدول را وارد کنید.'
          },
          notEmpty: {
            msg: 'لطفا نام جدول را وارد کنید.'
          },
          len: {
            args: [3, 50],
            msg: 'نام جدول کلمه‌ای بین ۳ تا ۵۰ کاراکتر می باشد.'
          }
        }
      },

      actionId: {
        type: DataTypes.INTEGER,
        allowNull:true,
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
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'Permission',
      freezeTableName: true,
      indexes:[
        // {
        //   name: 'ix_permissionName',
        //   unique: true,
        //   fields: ['name'],
        //   msg: 'این مجوز  تکراری می‌باشد... '
        // },
        {
          name: 'ix_entity_type_actionId',
          unique: true,
          fields: ['entity_type', 'actionId'],
          msg: 'این اکشن برای این جدول تکراری می‌باشد.... '
        },

      ],

      validate: {},

    }
  );

  Permission.associate = (models)=>{
    
    Permission.hasMany(models.RolePermissionModel, { foreignKey: 'permissionId', as: 'rolePermissions' });

    Permission.belongsTo(models.CodingDataModel, { foreignKey: 'actionId', as: 'action' })

    Permission.belongsTo(models.UserViewModel, { foreignKey: 'creatorId', as: 'creator' });
    Permission.belongsTo(models.UserViewModel, { foreignKey: 'updaterId', as: 'updater' });

  }
  return Permission;
};
