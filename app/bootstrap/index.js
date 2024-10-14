const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieparser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const {sequelize} = require('@models/index.js')


// const {connect} = require('../configs/dbConfig')


const loggerMiddleware = require("../middlewares/loggerMiddleware");

try{
  sequelize.sync({alter:true})
  console.log('All models were synchronized successfully')
}catch(error){
  console.log('Error in syncing models ... ',error)
}

module.exports = (app) => {
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieparser())
  app.use(session({
    secret: 'JaiShriGanesha',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:60000}
  }))
  app.use(flash())
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

  app.get('/test',(req,res)=>{
    res.send('Salam Hassan jan ....! Damam gharm .. Bazam damamm gharm ... !!!')
  })
  


  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../views"));

  app.engine("handlebars", hbs.engine());
  app.use("/static", express.static(path.join(__dirname, "../public")));
};
 