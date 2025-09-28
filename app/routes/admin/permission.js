const express = require('express')
const permissionControllers = require('@controllers/admin/permission')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')


router.get('/api/getData',[accessControlMiddleware('permissions','read')],permissionControllers.getData)

router.get('/index',[accessControlMiddleware('permissions','read')],permissionControllers.index)
router.get('/create',[accessControlMiddleware('permissions','create')],permissionControllers.create)
router.post('/store',[accessControlMiddleware('permissions','create')],permissionControllers.store)
router.get('/edit/:id',[accessControlMiddleware('permissions','edit')],permissionControllers.edit)
router.post('/update/:id',[accessControlMiddleware('permissions','edit')],permissionControllers.update)
router.get('/delete/:id',[accessControlMiddleware('permissions','delete')],permissionControllers.delete)

module.exports = router