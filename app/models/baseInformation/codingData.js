const { DataTypes } = require("sequelize");
const dateService = require("@services/dateService");

exports.CodingData = (sequelize) => {
  const CodingData = sequelize.define(
    "CodingData",
    {
      id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
      },      
      
      CodeTableListId:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },

      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          name: "ix_CodeTableListId_Title",
          args: true,
          msg: "این عنوان در این کدینگ  تکراری می‌باشد.... ",
        },
        validate: {
          notNull: {
            msg: "لطفا نام کدینگ جدول را وارد کنید.",
          },
          notEmpty: {
            msg: "لطفا نام کدینگ جدول را وارد کنید.",
          },
          len: {
            args: [2, 50],
            msg: "نام کدینگ جدول  باید کلمه‌ای بین 2 تا 50 کاراکتر باشد.",
          },
        },
      },

      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        get(){
          const value = this.getDataValue('description')
          return value === null ? '' : value
        },
        defaultValue: null,
        validate: {
          len: {
            args: [4, 250],
            msg: "توضیحات می‌بایست بین 4 تا 255 حرف باشد.",
          },
        },
      },

      sortId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // unique: {
        //   args:true,
        //   msg: 'کد نمی تواند تکراری باشد.'
        // },
        validate: {
          notNull: {
            msg: "لطفا مرتبه کدینگ جدول را وارد کنید.",
          },
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
          },
          min: {
            args: 1,
            msg: "مرتبه کدینگ عددی بین 1 تا 99 می باشد.",
          },
          max: {
            args: 99,
            msg: "مرتبه کدینگ عددی بین 1 تا 99 می باشد.",
          },
        },
      },

      refId: {
        type: DataTypes.STRING(4),
        allowNull: true,
        defaultValue: null,
        get(){
          const value = this.getDataValue('refId')
          return value === null ? '' : value
        },
        validate: {
          len: {
            args: [1, 4],
            msg: "کد ثانویه کدی  بین 1 تا 4 حرف  می‌باشد.",
          },
        },
      },

      creator: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: "لطفا نام ایجاد کننده را وارد کنید.",
          },
        },
      },

      updater: {
        type: DataTypes.STRING(50),
      },

      fa_createdAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue("createdAt");
          return dateService.toPersianDate(rawValue);
        },
      },

      fa_updatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue("updatedAt");
          return dateService.toPersianDate(rawValue);
        },
      },

      updatedAt: {
        type: DataTypes.DATE,
        default: null,
      },
    },
    {
      freezeTableName: true, // جلوگیری از تغییرات غیرمنتظره روی جدول
      sequelize,
      indexes: [
        {
          name: "ix_CodeTableListId_Title",
          unique: true,
          fields: ["CodeTableListId", "title"],
          msg: "این عنوان در این کدینگ  تکراری می‌باشد.... ",
        },
      ],
      validate: {},
      hooks:{
        async beforeValidate(record,options){
          if(!record.id){
            const lastRecord = await CodingData.findOne({
              where : {CodeTableListId:record.CodeTableListId},
              order : [['id','desc']]
            })
         
            const lastId = lastRecord ? lastRecord.id : record.CodeTableListId * 1000
            record.id = lastId + 1 
          }
        }
      }
      
    }
  );

  return CodingData;
};
