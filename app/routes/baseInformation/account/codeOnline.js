const express = require('express')
const codeOnlineControllers = require('@controllers/baseInformation/account/codeOnline')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/api/getData',[accessControlMiddleware('codeOnline','read')],codeOnlineControllers.getData)
router.get('/api/codeOnline/next',[accessControlMiddleware('codeOnline','read')],codeOnlineControllers.nextCode)

router.get('/index',[accessControlMiddleware('codeOnline','read')],codeOnlineControllers.index)
router.get('/create',[accessControlMiddleware('codeOnline','create')],codeOnlineControllers.create)
router.post('/store',[accessControlMiddleware('codeOnline','create')],codeOnlineControllers.store)
router.get('/edit/:id',[accessControlMiddleware('codeOnline','edit')],codeOnlineControllers.edit)
router.post('/update/:id',[accessControlMiddleware('codeOnline','edit')],codeOnlineControllers.update)
router.get('/delete/:id',[accessControlMiddleware('codeOnline','delete')],codeOnlineControllers.delete)

module.exports = router