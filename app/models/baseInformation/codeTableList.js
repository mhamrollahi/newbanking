const { DataTypes, Model } = require("sequelize");
const dateService = require('@services/dateService')

class CodeTableList extends Model {}

module.exports = (sequelize) => {

  CodeTableList.init({
    en_TableName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args:true,
          msg: 'نام انگلیسی جدول نمی تواند تکراری باشد.'
          },
        validate: {
          notNull:{
          msg: 'لطفا نام انگلیسی جدول را وارد کنید.'
          },
        notEmpty:{
          msg: 'لطفا نام انگلیسی جدول را وارد کنید.',
          },
        len: {
          args:[3,50],
          msg:'نام انگلیسی جدول  باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
          },
        }
    },
        
    fa_TableName:{
          type:DataTypes.STRING(50),
          allowNull: false,
          unique: {
            args:true,
            msg: 'نام فارسی جدول نمی تواند تکراری باشد.'
          },
          validate: {
            notNull:{
              msg: 'لطفا نام فارسی جدول را وارد کنید.'
            },
            notEmpty:{
              msg: 'لطفا نام فارسی جدول را وارد کنید.',
            },
            len: {
              args:[3,50],
              msg:'نام فارسی جدول باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
              },
          }
    },
        
    creator:{
          type:DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notNull:{
              msg: 'لطفا نام ایجاد کننده را وارد کنید.'
            },
          }
    },

    updatedAt:{
        type:DataTypes.DATE,
        default:null
    },

    updater:{
          type:DataTypes.STRING(50),
    },

    fa_createdAt:{
        type:DataTypes.VIRTUAL,
        get(){
          const rawValue = this.getDataValue('createdAt')
          return dateService.toPersianDate(rawValue)
        },
       
    },

    fa_updatedAt:{
        type:DataTypes.VIRTUAL,
        get(){
          const rawValue = this.getDataValue('updatedAt')
          return dateService.toPersianDate(rawValue)
      },
    },

    }, 
    {
      sequelize,
      validate:{},
  })

  static associate(models){
    this.hasMany(models.CodingDataModel,{foreignKey:'codeTableListId'})
  }
  
  return CodeTableList

}

