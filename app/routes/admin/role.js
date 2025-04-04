const express = require('express')
const roleControllers = require('@controllers/admin/role')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('roles','read')],roleControllers.getData)

router.get('/index',[accessControlMiddleware('roles','read')],roleControllers.index)
router.get('/create',[accessControlMiddleware('roles','create')],roleControllers.create)
router.post('/store',[accessControlMiddleware('roles','create')],roleControllers.store)
router.get('/edit/:id',[accessControlMiddleware('roles','edit')],roleControllers.edit)
router.post('/update/:id',[accessControlMiddleware('roles','edit')],roleControllers.update)
router.get('/delete/:id',[accessControlMiddleware('roles','delete')],roleControllers.delete)

module.exports = router