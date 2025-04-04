const express = require('express')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

const codingDataControllers = require('@controllers/baseInformation/codingData')

router.get('/codingData/api/getData/:id',[accessControlMiddleware('codingData','read')],codingDataControllers.getData)

router.get('/codingData/index/:id',[accessControlMiddleware('codingData','read')],codingDataControllers.index)
router.get('/codingData/create/:id',[accessControlMiddleware('codingData','create')],codingDataControllers.create)
router.post('/codingData/store/:id',[accessControlMiddleware('codingData','create')],codingDataControllers.store)
router.get('/codingData/edit/:id',[accessControlMiddleware('codingData','edit')],codingDataControllers.edit)
router.post('/codingData/update/:id',[accessControlMiddleware('codingData','edit')],codingDataControllers.update)
router.get('/codingData/delete/:id',[accessControlMiddleware('codingData','delete')],codingDataControllers.delete)


module.exports = router

