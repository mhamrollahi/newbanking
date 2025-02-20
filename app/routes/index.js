const accManagementRouter = require('./accountManagement/index')
const codeTableListRouter = require('./baseInformation/codeTableList')
const codingDataRouter = require('./baseInformation/codingData')
const importFilesRouter = require('./importFiles/importCodingData')
const usersRouter = require('./admin/users')
const personRouter = require('./admin/person')
const authRouter = require('./auth/index')

const authMiddleware = require('../middlewares/authMiddleware')

module.exports = (app) => {
  app.use('/accManagement',[authMiddleware],accManagementRouter)
  app.use('/baseInformation',[authMiddleware],codeTableListRouter)
  app.use('/baseInformation',[authMiddleware],codingDataRouter)
  app.use('/importFiles',[authMiddleware],importFilesRouter)
  app.use('/admin/users',[authMiddleware],usersRouter)
  app.use('/admin/person',personRouter)
  app.use('/auth',authRouter)
}
