const accManagementRouter = require('./accountManagement/index')
const codeTableListRouter = require('./baseInformation/codeTableList')
const codingDataRouter = require('./baseInformation/codingData')
const importFilesRouter = require('./importFiles/importCodingData')
const usersRouter = require('./admin/user')
const personRouter = require('./admin/person')
const roleRouter = require('./admin/role')
const permissionRouter = require('./admin/permission')
const rolePermissionRouter = require('./admin/rolePermission')
const userRoleRouter = require('./admin/userRole')

const authRouter = require('./auth/index')

const authMiddleware = require('../middlewares/authMiddleware')

module.exports = (app) => {
  app.use('/accManagement',[authMiddleware],accManagementRouter)
  
  app.use('/baseInformation',[authMiddleware],codeTableListRouter)
  app.use('/baseInformation',[authMiddleware],codingDataRouter)
  
  app.use('/importFiles',[authMiddleware],importFilesRouter)
  
  app.use('/admin/users',[authMiddleware],usersRouter)
  app.use('/admin/person',[authMiddleware],personRouter)
  app.use('/admin/role',[authMiddleware],roleRouter)
  app.use('/admin/permission',[authMiddleware],permissionRouter)
  app.use('/admin/rolePermission',[authMiddleware],rolePermissionRouter)
  app.use('/admin/userRole',[authMiddleware],userRoleRouter)

  app.use('/auth',authRouter)
}
