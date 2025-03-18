const Sequelize = require('sequelize')
const codeTableListModel = require('./baseInformation/codeTableList')
const codingDataModel = require('./baseInformation/codingData')
const userModel = require('./admin/user.js')
const personModel = require('./admin/person.js')

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

// const CodeTableListModel = codeTableListModel.CodeTableList(sequelize)
// const CodingDataModel = codingDataModel.CodingData(sequelize)

const models = {
  CodeTableListModel:codeTableListModel(sequelize),
  CodingDataModel : codingDataModel(sequelize),
  PersonModel : personModel(sequelize),
  UserModel : userModel(sequelize),
}

Object.values(models).forEach((model)=>{
  if(model.associate){
    model.associate(models)
  }
})



module.exports = {
  sequelize,
  models,
  // CodeTableListModel,
  // CodingDataModel,
  // UserModel,
  // PersonModel,
}