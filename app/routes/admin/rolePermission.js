const express = require('express')
const rolePermissionControllers = require('@controllers/admin/rolePermission')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('rolePermissions','read')],rolePermissionControllers.getData)

router.get('/index',[accessControlMiddleware('rolePermissions','read')],rolePermissionControllers.index)
router.get('/create',[accessControlMiddleware('rolePermissions','create')],rolePermissionControllers.create)
router.post('/store',[accessControlMiddleware('rolePermissions','create')],rolePermissionControllers.store)
router.post('/bulkStore',[accessControlMiddleware('rolePermissions','create')],rolePermissionControllers.bulkStore)
router.get('/edit/:id',[accessControlMiddleware('rolePermissions','edit')],rolePermissionControllers.edit)
router.post('/update/:id',[accessControlMiddleware('rolePermissions','edit')],rolePermissionControllers.update)
router.get('/delete/:id',[accessControlMiddleware('rolePermissions','delete')],rolePermissionControllers.delete)

module.exports = router