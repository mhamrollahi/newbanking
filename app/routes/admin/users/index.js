const express = require('express')
const usersControllers = require('@controllers/admin/users')
const router = express.Router()

router.get('/index',usersControllers.index)


// router.get('/block',accManagementControllers.block)
// router.post('/cancel',accManagementControllers.canceling)
// router.get('/create',accManagementControllers.create)
// router.post('/opening',accManagementControllers.opening)


module.exports = router