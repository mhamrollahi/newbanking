const express = require('express')
const rolePermissionControllers = require('@controllers/admin/rolePermission')
const router = express.Router()

router.get('/api/getData',rolePermissionControllers.getData)

router.get('/index',rolePermissionControllers.index)
router.get('/create',rolePermissionControllers.create)
router.post('/store',rolePermissionControllers.store)
router.get('/edit/:id',rolePermissionControllers.edit)
router.post('/update/:id',rolePermissionControllers.update)
router.get('/delete/:id',rolePermissionControllers.delete)

module.exports = router