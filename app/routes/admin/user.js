const express = require('express')
const usersControllers = require('@controllers/admin/user')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('users','read')],usersControllers.getData)
router.post('/api/updateUserActive/:id',[accessControlMiddleware('users','edit')],usersControllers.updateUserActive)

router.get('/index',[accessControlMiddleware('users','read')],usersControllers.index)
router.get('/create',[accessControlMiddleware('users','create')],usersControllers.create)
router.post('/store',[accessControlMiddleware('users','create')],usersControllers.store)
router.get('/edit/:id',[accessControlMiddleware('users','edit')],usersControllers.edit)
router.post('/update/:id',[accessControlMiddleware('users','edit')],usersControllers.update)
router.get('/delete/:id',[accessControlMiddleware('users','delete')],usersControllers.delete)

module.exports = router