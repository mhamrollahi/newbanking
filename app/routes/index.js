const accManagementRouter = require('./accountManagement/index')
const codeTableListRouter = require('./baseInformation/codeTableList')
const codingDataRouter = require('./baseInformation/codingData')
const importFilesRouter = require('./importFiles/importCodingData')

module.exports = (app) => {
  app.use('/accManagement',accManagementRouter)
  app.use('/baseInformation',codeTableListRouter)
  app.use('/baseInformation',codingDataRouter)
  app.use('/importFiles',importFilesRouter)
}
