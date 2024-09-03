const express = require('express')
const router = express.Router()
const baseInformationControllers = require('@controllers/baseInformation')

router.get('/index',baseInformationControllers.index)

module.exports = router