const Sequelize = require('sequelize')
const codeTableListModel = require('./baseInformation/codeTableList')
const codingDataModel = require('./baseInformation/codingData')
const userModel = require('./admin/users/user')
const personModel = require('./admin/people')

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

const CodeTableListModel = codeTableListModel.CodeTableList(sequelize)
const CodingDataModel = codingDataModel.CodingData(sequelize)
const UserModel = userModel.User(sequelize)
const PersonModel = personModel.Person(sequelize)

CodeTableListModel.hasMany(CodingDataModel, {foreignKey:'CodeTableListId'} )
CodingDataModel.belongsTo(CodeTableListModel, {foreignKey:'CodeTableListId'})


// const ContactModel = contactModel.Contact(sequelize)
// const ContactCategoryModel = contactCategoryModel.ContactCategory(sequelize)
// ContactCategoryModel.hasMany(ContactModel);
// ContactModel.belongsTo(ContactCategoryModel);


module.exports = {
  sequelize,
  CodeTableListModel,
  CodingDataModel,
  UserModel,
  PersonModel,
}