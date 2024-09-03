const accManagementRouter = require('./accManagement')
const baseInformationRouter = require('./baseInformation')

module.exports = (app) => {
  app.use('/accManagement',accManagementRouter)
  app.use('/baseInformation',baseInformationRouter)
}
