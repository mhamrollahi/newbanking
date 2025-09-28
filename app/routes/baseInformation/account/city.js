const express = require('express')
const cityControllers = require('@controllers/baseInformation/account/city')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')


router.get('/api/getData',[accessControlMiddleware('cities','read')],cityControllers.getData)

router.get('/index',[accessControlMiddleware('cities','read')],cityControllers.index)
router.get('/create',[accessControlMiddleware('cities','create')],cityControllers.create)
router.post('/store',[accessControlMiddleware('cities','create')],cityControllers.store)
router.get('/edit/:id',[accessControlMiddleware('cities','edit')],cityControllers.edit)
router.post('/update/:id',[accessControlMiddleware('cities','edit')],cityControllers.update)
router.get('/delete/:id',[accessControlMiddleware('cities','delete')],cityControllers.delete)

module.exports = router