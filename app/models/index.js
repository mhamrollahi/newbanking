const Sequelize = require('sequelize')
const codeTableListModel = require('./baseInformation/codeTableList')
const codingDataModel = require('./baseInformation/codingData')
const userModel = require('./admin/users/user')
const personModel = require('./admin/person')

// const contactModel = require('./auth/contact')
// const contactCategoryModel = require('./auth/contactCategory')

const sequelize = new Sequelize({
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.APP_DIALECT,
  logging: false,  
  port: process.env.MYSQL_PORT,
})


async function getConnection(){
  try{
    await sequelize.authenticate()
    console.log('Sequelize is init ...')
  }catch(err){
    console.log('connection failed !!!  ',err)
    return err
  }
}

getConnection()

const models = {
   CodeTableListModel : codeTableListModel(sequelize),
   CodingDataModel : codingDataModel(sequelize),
   PersonModel : personModel(sequelize),
   UserModel : userModel(sequelize)
}


Object.keys(models).forEach((modelName)=>{
  if(models[modelName].associate){
    models[modelName].associate(models)
  }
})


// models.CodeTableListModel.hasMany(models.CodingDataModel, {
//   foreignKey:{
//     name:'CodeTableListId',
//     allowNull:false,
//     onDelete:'RESTRICT',
//     onUpdate:'RESTRICT'
//   }
// })
// models.CodingDataModel.belongsTo(models.CodeTableListModel, {
//   foreignKey:{
//     name:'CodeTableListId',
//     allowNull:false,
//     onDelete:'RESTRICT',
//     onUpdate:'RESTRICT'
//   }
// })

// models.PersonModel.hasMany(UserModel, {
//   foreignKey:{
//     name:'PersonId',
//     allowNull:false,
//     onDelete:'RESTRICT',
//     onUpdate:'RESTRICT'
//   }
// })
// UserModel.belongsTo(models.PersonModel, {
//   foreignKey:{
//     name:'PersonId',
//     allowNull:false,
//     onDelete:'RESTRICT',
//     onUpdate:'RESTRICT'
//   }
// })


// const ContactModel = contactModel.Contact(sequelize)
// const ContactCategoryModel = contactCategoryModel.ContactCategory(sequelize)
// ContactCategoryModel.hasMany(ContactModel);
// ContactModel.belongsTo(ContactCategoryModel);


module.exports = {
  sequelize,
  models,
  // CodeTableListModel,
  // CodingDataModel,
  // UserModel,
  // PersonModel,
}
