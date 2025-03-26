const express = require('express')
const userRoleControllers = require('@controllers/admin/userRole')
const router = express.Router()

router.get('/api/getData',userRoleControllers.getData)

router.get('/index',userRoleControllers.index)
router.get('/create',userRoleControllers.create)
router.post('/store',userRoleControllers.store)
router.post('/bulkStore',userRoleControllers.bulkStore)
router.get('/edit/:id',userRoleControllers.edit)
router.post('/update/:id',userRoleControllers.update)
router.get('/delete/:id',userRoleControllers.delete)

module.exports = router