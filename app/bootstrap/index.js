const express = require('express')
const bodyParser = require('body-parser')
const loggerMiddleware = require('../middlewares/loggerMiddleware')
// const errorHandlerMiddleware = require('../middlewares/errorHandlerMiddleware')

module.exports = (app) => {
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended : false}))
  
  app.use(loggerMiddleware)
  // app.use(errorHandlerMiddleware)
}