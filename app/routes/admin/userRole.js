const express = require('express')
const userRoleControllers = require('@controllers/admin/userRole')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('userRoles','read')],userRoleControllers.getData)

router.get('/index',[accessControlMiddleware('userRoles','read')],userRoleControllers.index)
router.get('/create',[accessControlMiddleware('userRoles','create')],userRoleControllers.create)
router.post('/store',[accessControlMiddleware('userRoles','create')],userRoleControllers.store)
router.post('/bulkStore',[accessControlMiddleware('userRoles','create')],userRoleControllers.bulkStore)
router.get('/edit/:id',[accessControlMiddleware('userRoles','edit')],userRoleControllers.edit)
router.post('/update/:id',[accessControlMiddleware('userRoles','edit')],userRoleControllers.update)
router.get('/delete/:id',[accessControlMiddleware('userRoles','delete')],userRoleControllers.delete)

module.exports = router