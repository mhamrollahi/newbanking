const express = require('express')
const rolePermissionControllers = require('@controllers/admin/rolePermission')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('rolePermission','read')],rolePermissionControllers.getData)

router.get('/index',[accessControlMiddleware('rolePermission','read')],rolePermissionControllers.index)
router.get('/create',[accessControlMiddleware('rolePermission','create')],rolePermissionControllers.create)
router.post('/store',[accessControlMiddleware('rolePermission','create')],rolePermissionControllers.store)
router.post('/bulkStore',[accessControlMiddleware('rolePermission','create')],rolePermissionControllers.bulkStore)
router.get('/edit/:id',[accessControlMiddleware('rolePermission','edit')],rolePermissionControllers.edit)
router.post('/update/:id',[accessControlMiddleware('rolePermission','edit')],rolePermissionControllers.update)
router.get('/delete/:id',[accessControlMiddleware('rolePermission','delete')],rolePermissionControllers.delete)

module.exports = router