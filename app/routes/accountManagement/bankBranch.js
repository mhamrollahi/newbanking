const express = require('express')
const bankBranchControllers = require('@controllers/accountManagement/bankBranch')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')


router.get('/api/getData',[accessControlMiddleware('bankbranches','read')],bankBranchControllers.getData)

router.get('/index',[accessControlMiddleware('bankbranches','read')],bankBranchControllers.index)
router.get('/create',[accessControlMiddleware('bankbranches','create')],bankBranchControllers.create)
router.post('/store',[accessControlMiddleware('bankbranches','create')],bankBranchControllers.store)
router.get('/edit/:id',[accessControlMiddleware('bankbranches','edit')],bankBranchControllers.edit)
router.post('/update/:id',[accessControlMiddleware('bankbranches','edit')],bankBranchControllers.update)
router.get('/delete/:id',[accessControlMiddleware('bankbranches','delete')],bankBranchControllers.delete)

module.exports = router