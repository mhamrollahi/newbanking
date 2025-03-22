const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { sequelize } = require('@models/index.js');

// const {connect} = require('../configs/dbConfig')

const loggerMiddleware = require('../middlewares/loggerMiddleware');

try {
  sequelize.sync({ alter: false });
  console.log('All models were synchronized successfully');
} catch (error) {
  console.log('Error in syncing models ... ', error);
}

module.exports = (app) => {
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

  app.use(flash());
  app.use(cors());

  app.use(loggerMiddleware);

  // connect()
  //   .then((connection) => {
  //     console.log('Connected to the database successfully...')
  //   })
  //   .catch((error)=>{
  //     console.log('Database connection failed ...!!')
  //     console.log(error)
  //   })

  app.get('/test', (req, res) => {
    res.send('Salam Hassan jan ....! Damam gharm .. Bazam damamm gharm ... !!!');
  });

  // hbs.registerPartials(path.join(__dirname,'../views/partials'))

  app.set('view engine', 'handlebars');
  app.set('views', path.join(__dirname, '../views'));

  app.engine(
    'handlebars',
    hbs.engine({
      layoutsDir: path.join(__dirname, '../views/layouts'),
      partialsDir: path.join(__dirname, '../views/partials')
    })
  );
  app.use('/static', express.static(path.join(__dirname, '../public')));
};
