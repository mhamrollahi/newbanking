const accManagementRouter = require('./accManagement')

module.exports = (app) => {
  app.use('/accManagement',accManagementRouter)
}
