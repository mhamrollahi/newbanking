const Sequelize = require('sequelize')
const MsSqlDialect = require('@sequelize/mssql')
const codeTableListModel = require('./baseInformation/codeTableList.js')
// const codingDataModel = require('@models/baseInformation/codingData')

console.log('in sequelize section ...')


const sequelize = new Sequelize({
  dialect: 'mssql',
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  port : process.env.MSSQL_PORT,
  options:{
    trustedConnection : true,
    enableArithAbort : true,
    trustServerCertificate : true,
  },
})


async function getConnection(){
  try{
    await sequelize.authenticate()
    console.log('connected ...')
  }catch(err){
    console.log('connection failed !!!  ',err)
    return err
  }
}
getConnection()

// const CodeTableList = codeTableListModel(sequelize)

console.log('in sequelize section 2 ...')
// exports.CodingData = codingDataModel(sequelize)


module.exports = {sequelize}