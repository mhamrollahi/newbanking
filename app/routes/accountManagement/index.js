const express = require('express')
const accManagementControllers = require('@controllers/accountManagement')
const router = express.Router()

router.get('/index',accManagementControllers.index)
router.get('/block',accManagementControllers.block)
// router.post('/cancel',accManagementControllers.canceling)
// router.get('/create',accManagementControllers.create)
// router.post('/opening',accManagementControllers.opening)


module.exports = router