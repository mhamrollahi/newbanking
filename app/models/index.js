const Sequelize = require('sequelize');
const codeTableListModel = require('./baseInformation/codeTableList');
const codingDataModel = require('./baseInformation/codingData');
const userModel = require('./admin/user');
const personModel = require('./admin/person');
const userViewModel = require('./admin/userView');
const permissionModel = require('./admin/permission');
const roleModel = require('./admin/role');
const userRoleModel = require('./admin/userRole');
const rolePermissionModel = require('./admin/rolePermission');
const bankBranchModel = require('./accountManagement/bankBranch');

const sequelize = new Sequelize({
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dialect: process.env.APP_DIALECT,
  logging: false,
  port: process.env.MYSQL_PORT
});

async function getConnection() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize is init ...');
  } catch (err) {
    console.log('connection failed !!!  ', err);
    return err;
  }
}
getConnection();


const models = {
  CodeTableListModel: codeTableListModel(sequelize),
  CodingDataModel: codingDataModel(sequelize),
  PersonModel: personModel(sequelize),
  UserModel: userModel(sequelize),
  UserViewModel: userViewModel(sequelize),
  PermissionModel: permissionModel(sequelize),
  RoleModel: roleModel(sequelize),
  UserRoleModel: userRoleModel(sequelize),
  RolePermissionModel: rolePermissionModel(sequelize),
  BankBranchModel: bankBranchModel(sequelize),
  
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

(async () => {
  for (const model of Object.values(models)) {
    if (typeof model.createPermissions === 'function' && model.name === 'BankBranch') {
      try {
        await model.createPermissions(models);
        console.log(`✅ Permissions created for ${model.name}`);
      } catch (err) {
        console.error(`❌ Failed to create permissions for ${model.name}:`, err.message);
      }
    }
  }
})();

module.exports = {
  sequelize,
  models
};
