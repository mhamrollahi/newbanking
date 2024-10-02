const sequelize = require("sequelize");
const { Model, DataTypes } = require("sequelize");

exports.CodeTableList = (sequelize) => {
  console.log('in function CodeTableList ..')
  const CodeTableList = sequelize.define('CodeTableList',{
      code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: {
          args:true,
          msg: 'کد نمی تواند تکراری باشد.'
        },
        validate: {
          notNull:{
            msg: 'لطفا یک کد سه رقمی وارد کنید.'
          },
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
          },
          notEmpty:{
            msg: 'لطفا یک کد سه رقمی وارد کنید.',
          },
          len:{
            args:[1,3],
            msg: 'کد باید سه رقمی باشد.'
          },
        }
      },
      
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
            min: {
              args:5,
              msg:'نام انگلیسی جدول حداقل باید 5 کاراکتر باشد.'
            },
            max: {
              args:50,
              msg:'نام انگلیسی جدول حداکثر باید 50 کاراکتر باشد.'
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
            min: {
              args:5,
              msg:'نام فارسی جدول حداقل باید 5 کاراکتر باشد.'
            },
            max: {
              args:50,
              msg:'نام فارسی جدول حداکثر باید 50 کاراکتر باشد.'
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
      }

      }, {
        sequelize,
        validate:{
          
      }
  })
  console.log(CodeTableList)
  return CodeTableList
}

// class CodeTableList extends Model{
//   static init(sequelize,DataTypes) {
//     return super.init({
//       code: {
//         type: DataTypes.STRING(3),
//         allowNull: false,
//         unique: {
//           args:true,
//           msg: 'کد نمی تواند تکراری باشد.'
//         },
//         validate: {
//           notNull:{
//             msg: 'لطفا یک کد سه رقمی وارد کنید.'
//           },
//           isNumeric: {
//             msg: "کد فقط باید عدد باشد.",
//           },
//           notEmpty:{
//             msg: 'لطفا یک کد سه رقمی وارد کنید.',
//           },
//           len:{
//             args:[1,3],
//             msg: 'کد باید سه رقمی باشد.'
//           },
//         }
//       },
      
//       en_TableName: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//         unique: {
//           args:true,
//             msg: 'نام انگلیسی جدول نمی تواند تکراری باشد.'
//           },
//           validate: {
//             notNull:{
//               msg: 'لطفا نام انگلیسی جدول را وارد کنید.'
//             },
//             notEmpty:{
//               msg: 'لطفا نام انگلیسی جدول را وارد کنید.',
//             },
//             min: {
//               args:5,
//               msg:'نام انگلیسی جدول حداقل باید 5 کاراکتر باشد.'
//             },
//             max: {
//               args:50,
//               msg:'نام انگلیسی جدول حداکثر باید 50 کاراکتر باشد.'
//             },
//           }
//         },
        
//         fa_TableName:{
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
//             min: {
//               args:5,
//               msg:'نام فارسی جدول حداقل باید 5 کاراکتر باشد.'
//             },
//             max: {
//               args:50,
//               msg:'نام فارسی جدول حداکثر باید 50 کاراکتر باشد.'
//             },
//           }
//         },
        
//         creator:{
//           type:DataTypes.STRING(25),
//           allowNull: false,
//           validate: {
//             notNull:{
//               msg: 'لطفا نام ایجاد کننده را وارد کنید.'
//             },
//           }
//         },

//         updater:{
//           type:DataTypes.STRING(25),
//         }

//       }, {
//         sequelize,
//         validate:{
          
//       }
//     })
//   }
// }

// console.log(CodeTableList)

// module.exports = {CodeTableList}
console.log('in codeTableList . js file 3 ')