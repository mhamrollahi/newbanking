const accManagementRouter = require('./accManagement')
const codeTableListRouter = require('./baseInformation/codeTableList')
const codingDataRouter = require('./baseInformation/codingData')

module.exports = (app) => {
  app.use('/accManagement',accManagementRouter)
  app.use('/baseInformation',codeTableListRouter)
  app.use('/baseInformation',codingDataRouter)
}
