const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
// const { sequelize } = require('@models/index.js');
const limiter = require('@security/rateLimiter.js');
const menuRoute = require('@routes/menu.js');
const handlebarsHelpers = require('../helpers/handlebarsHelper');

// const {connect} = require('../configs/dbConfig')

const loggerMiddleware = require('../middlewares/loggerMiddleware');

// try {
//   sequelize.sync({ alter: false });
//   console.log('All models were synchronized successfully');
// } catch (error) {
//   console.log('Error in syncing models ... ', error);
// }

module.exports = (app) => {
  // app.use(limiter);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieparser());

  app.use(
    session({
      secret: 'JaiShriGanesha',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 900000 }, // دقیقه 15*60*1000
      unset: 'destroy'
    })
  );

  app.use((req, res, next) => {
    if (!req.session.menuState) {
      req.session.menuState = {};
    }
    next();
  });

  app.use(menuRoute);

  app.use(flash());
  app.use(cors());

  app.use(loggerMiddleware);

  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../views'));

  app.engine(
    'handlebars',
    hbs.engine({
      layoutsDir: path.join(__dirname, '../views/layouts'),
      partialsDir: path.join(__dirname, '../views/partials'),
      helpers: {
        ...handlebarsHelpers,
        hasPermissionName: function (array, value) {
          if (!array) return false;

          //console.log("in hasPermissionName : 🔍 roleName : ", array.length==0 ? 'empty' : array[0].roleName);
          // console.log("in hasPermissionName : 🔎 User Permissions: value ", value);
          if (array.some((item) => item.roleName === 'admin')) return true;

          return array.some((item) => item.permissionName.toLowerCase() === value.toLowerCase());
        },
        hasPermissionAction: function (permissionList, entityType, action) {
          if (!permissionList) return false;

          //console.log("in hasPermissionAction : 🔍 roleName : ", permissionList[0].roleName);

          if (permissionList.some((item) => item.roleName === 'admin')) return true;

          return permissionList.some((permission) => permission.permissionEntity_type.toLowerCase() === entityType.toLowerCase() && permission.actionName.toLowerCase() === action.toLowerCase());
        }
      }
    })
  );

  const favicon = require('serve-favicon');
  app.use(favicon(path.join(__dirname, '../public/assets/images/favicon.ico')));

  app.use('/static', express.static(path.join(__dirname, '../public')));
};
