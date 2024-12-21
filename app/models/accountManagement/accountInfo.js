// const { DataTypes } = require("sequelize");
// const dateService = require('@services/dateService')


// exports.CodeTableList = (sequelize) => {
//   const CodeTableList = sequelize.define('CodeTableList',{
//     code: {
//         type: DataTypes.STRING(3),
//         allowNull: false,
//         unique: {
//           args:true,
//           msg: 'کد نمی تواند تکراری باشد.'
//         },
//         validate: {
//           notNull:{
//           msg: 'لطفا یک کد سه رقمی وارد کنید.'
//           },
//           isNumeric: {
//           msg: "کد فقط باید عدد باشد.",
//           },
//           notEmpty:{
//           msg: 'لطفا یک کد سه رقمی وارد کنید.',
//           },
//           len:{
//           args:[1,3],
//           msg: 'کد یک عدد بین یک تا سه رقم باشد.'
//           },
//         }
//     },
      
//     en_TableName: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//         // get(){
//         //   const rawValue = this.getDataValue('en_TableName') + ' -- '
//         //   return rawValue.toUpperCase()
//         // },
//         unique: {
//           args:true,
//           msg: 'نام انگلیسی جدول نمی تواند تکراری باشد.'
//           },
//         validate: {
//           notNull:{
//           msg: 'لطفا نام انگلیسی جدول را وارد کنید.'
//           },
//         notEmpty:{
//           msg: 'لطفا نام انگلیسی جدول را وارد کنید.',
//           },
//         len: {
//           args:[3,50],
//           msg:'نام انگلیسی جدول  باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
//           },
//         }
//     },
        
//     fa_TableName:{
//           type:DataTypes.STRING(50),
//           allowNull: false,
//           unique: {
//             args:true,
//             msg: 'نام فارسی جدول نمی تواند تکراری باشد.'
//           },
//           validate: {
//             notNull:{
//               msg: 'لطفا نام فارسی جدول را وارد کنید.'
//             },
//             notEmpty:{
//               msg: 'لطفا نام فارسی جدول را وارد کنید.',
//             },
//             len: {
//               args:[3,50],
//               msg:'نام فارسی جدول باید کلمه‌ای بین 3 تا 50 کاراکتر باشد.'
//               },
//           }
//     },
        
//     creator:{
//           type:DataTypes.STRING(50),
//           allowNull: false,
//           validate: {
//             notNull:{
//               msg: 'لطفا نام ایجاد کننده را وارد کنید.'
//             },
//           }
//     },

//     updatedAt:{
//         type:DataTypes.DATE,
//         default:null
//     },

//     updater:{
//           type:DataTypes.STRING(50),
//     },

//     fa_createdAt:{
//         type:DataTypes.VIRTUAL,
//         get(){
//           const rawValue = this.getDataValue('createdAt')
//           return dateService.toPersianDate(rawValue)
//         },
       
//     },

//     fa_updatedAt:{
//         type:DataTypes.VIRTUAL,
//         get(){
//           const rawValue = this.getDataValue('updatedAt')
//           return dateService.toPersianDate(rawValue)
//       },
//     },

//     }, {
//       sequelize,
//       validate:{}
//   })

//   return CodeTableList

// }

