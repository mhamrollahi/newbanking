const express = require('express')
const router = express.Router()

const codingDataControllers = require('@controllers/baseInformation/codingData')

router.get('/codingData/index/:id',codingDataControllers.index)
router.get('/codingData/create/:id',codingDataControllers.create)
router.post('/codingData/store/:id',codingDataControllers.store)
router.get('/codingData/edit/:id',codingDataControllers.edit)
router.post('/codingData/update/:id',codingDataControllers.update)
router.get('/codingData/delete/:id',codingDataControllers.delete)


module.exports = router

