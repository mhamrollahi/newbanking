const Sequelize = require('sequelize')
const codeTableListModel = require('./baseInformation/codeTableList')
const codingDataModel = require('./baseInformation/codingData')

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

// const test11 = codeTableListModel.test1('salam ... ')

const CodeTableListModel = codeTableListModel.CodeTableList(sequelize)
const CodingDataModel = codingDataModel.CodingData(sequelize)

CodingDataModel.hasMany(CodeTableListModel,{onDelete:'cascade'})
CodeTableListModel.belongsTo(CodingDataModel)


module.exports = {sequelize,
  CodeTableListModel,
  CodingDataModel,
}