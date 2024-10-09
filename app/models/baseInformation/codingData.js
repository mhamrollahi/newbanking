const sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const dateService = require('@services/dateService')

exports.test1 = (arg)=>{
  arg = arg + ' test'
  console.log('in test1 function ..  ', arg)
}


exports.CodingData = (sequelize) => {
  const CodingData = sequelize.define('CodingData',{
    codeTableListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args:true,
          msg: 'کد نمی تواند تکراری باشد.'
        },
        validate:{
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
            }
          }
        },
          
        title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          args:true,
          msg: 'نام کدینگ نمی تواند تکراری باشد.'
          },
        validate: {
          notNull:{
          msg: 'لطفا نام کدینگ جدول را وارد کنید.'
          },
        notEmpty:{
          msg: 'لطفا نام کدینگ جدول را وارد کنید.',
          },
        len: {
          args:[3,50],
          msg:'نام انگلیسی جدول  باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
          },
        }
      },
        
      description:{
        type:DataTypes.STRING(255),
      },
        
      sortId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          args:true,
          msg: 'کد نمی تواند تکراری باشد.'
        },
        validate:{
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
            }
          }
        },
          
        refId: {
          type: DataTypes.STRING(30),
          
          validate:{
              len:{
                args:[1,3],
                msg: 'کد ثانویه  بین 3 تا 30 کاراکتر باشد.'
                },
            }
          },
            
        creator:{
          type:DataTypes.STRING(25),
          allowNull: false,
          validate: {
            notNull:{
              msg: 'لطفا نام ایجاد کننده را وارد کنید.'
            },
          }
      },

      updater:{
          type:DataTypes.STRING(25),
      },

      fa_createdAt:{
        type:DataTypes.VIRTUAL,
        get(){
          const rawValue = this.getDataValue('createdAt')
          return dateService.toPersianDate(rawValue)
        },

        fa_updatedAt:{
        type:DataTypes.VIRTUAL,
        get(){
          const rawValue = this.getDataValue('updatedAt')
          return dateService.toPersianDate(rawValue)
        },
       
      }

      }, {
        sequelize,
        validate:{
          
      }
  })
  // console.log(CodeTableList)
  return CodingData
}

