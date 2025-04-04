const express = require('express')
const personControllers = require('@controllers/admin/person')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('people','read')],personControllers.getData)
// router.post('/api/updateUserActive/:id',peopleControllers.updateUserActive)

router.get('/index',[accessControlMiddleware('people','read')],personControllers.index)
router.get('/create',[accessControlMiddleware('people','create')],personControllers.create)
router.post('/store',[accessControlMiddleware('people','create')],personControllers.store)
router.get('/edit/:id',[accessControlMiddleware('people','edit')],personControllers.edit)
router.post('/update/:id',[accessControlMiddleware('people','edit')],personControllers.update)
router.get('/delete/:id',[accessControlMiddleware('people','delete')],personControllers.delete)

module.exports = router