const Sequelize = require('@sequelize/core')
const MsSqlDialect = require('@sequelize/mssql')
const codeTableListModel = require('@models/baseInformation/codeTableList')
const codingDataModel = require('@models/baseInformation/codingData')

const sequelize = new Sequelize({
  dialect: MsSqlDialect,
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

exports.CodeTableList = codeTableListModel(sequelize)
exports.CodingData = codingDataModel(sequelize)

module.exports = {sequelize}