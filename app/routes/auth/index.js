const express = require('express')
const authController = require('@controllers/auth')
const router = express.Router()

// router.get('/api/getData',usersControllers.getData)
// router.post('/api/updateUserActive/:id',usersControllers.updateUserActive)

router.get('/login',authController.login)
router.post('/login',authController.doLogin)

// router.get('/create',usersControllers.create)
// router.post('/store',usersControllers.store)
// router.get('/edit/:id',usersControllers.edit)
// router.post('/update/:id',usersControllers.update)
// router.get('/delete/:id',usersControllers.delete)

module.exports = router