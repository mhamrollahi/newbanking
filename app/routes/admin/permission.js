const express = require('express')
const permissionControllers = require('@controllers/admin/permission')
const router = express.Router()

router.get('/api/getData',permissionControllers.getData)

router.get('/index',permissionControllers.index)
router.get('/create',permissionControllers.create)
router.post('/store',permissionControllers.store)
router.get('/edit/:id',permissionControllers.edit)
router.post('/update/:id',permissionControllers.update)
router.get('/delete/:id',permissionControllers.delete)

module.exports = router