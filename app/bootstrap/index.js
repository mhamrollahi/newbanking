const express = require('express')
const hbs = require('express-handlebars')
const path = require('path') 

const bodyParser = require('body-parser')
const loggerMiddleware = require('../middlewares/loggerMiddleware')

module.exports = (app) => {
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended : false}))
  
  app.use(loggerMiddleware)

  app.set("view engine","handlebars")
  app.set("views",path.join(__dirname,"../views"))

  app.engine('handlebars',hbs.engine())
  app.use('/static',express.static(path.join(__dirname,"../public")))
}