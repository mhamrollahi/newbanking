const accManagementRouter = require('./accountManagement/index');
const codeTableListRouter = require('./baseInformation/codeTableList');
const codingDataRouter = require('./baseInformation/codingData');
const importFilesRouter = require('./importFiles/importCodingData');
const usersRouter = require('./admin/user');
const personRouter = require('./admin/person');
const roleRouter = require('./admin/role');
const permissionRouter = require('./admin/permission');
const rolePermissionRouter = require('./admin/rolePermission');
const userRoleRouter = require('./admin/userRole');
const cityRouter = require('./baseInformation/account/city');
const bankBranchRouter = require('./baseInformation/account/bankBranch');
const organizationMasterDataRouter = require('./baseInformation/organization/masterData.js');
const codeOnlineRouter = require('./baseInformation/account/codeOnline.js');
const accountOpenRouter = require('./accountManagement/accountOpen.js');

const errorRoute = require('./errors/index');

const authRouter = require('./auth/index');

const authMiddleware = require('@middlewares/authMiddleware');

module.exports = (app) => {

  app.get('/test', (req, res) => {
    res.send('این یک آزمایش است');
  });

  //مسیر اصلی
  app.get('/', (req, res) => {
    res.redirect('/auth/login');
  });

  app.use('/accManagement', [authMiddleware], accManagementRouter);
  app.use('/accManagement/accountOpen', [authMiddleware], accountOpenRouter);

  app.use('/baseInformation', [authMiddleware], codeTableListRouter);
  app.use('/baseInformation', [authMiddleware], codingDataRouter);

  app.use('/baseInformation/account/city', [authMiddleware], cityRouter);
  app.use('/baseInformation/account/bankBranch', [authMiddleware], bankBranchRouter);
  app.use('/baseInformation/account/codeOnline', [authMiddleware], codeOnlineRouter); 
  app.use('/baseInformation/organization/masterData', [authMiddleware], organizationMasterDataRouter);

  app.use('/importFiles', [authMiddleware], importFilesRouter);

  app.use('/admin/users', [authMiddleware], usersRouter);
  app.use('/admin/person', [authMiddleware], personRouter);
  app.use('/admin/role', [authMiddleware], roleRouter);
  app.use('/admin/permission', [authMiddleware], permissionRouter);
  app.use('/admin/rolePermission', [authMiddleware], rolePermissionRouter);
  app.use('/admin/userRole', [authMiddleware], userRoleRouter);

  app.use('/errors', errorRoute);
  app.use('/auth', authRouter);
};
