const express = require('express')
const cityControllers = require('@controllers/accountManagement/city')
const router = express.Router()
const accessControlMiddleware = require('@middlewares/accessControlMiddleware')


router.get('/api/getData',[accessControlMiddleware('cites','read')],cityControllers.getData)

router.get('/index',[accessControlMiddleware('cites','read')],cityControllers.index)
router.get('/create',[accessControlMiddleware('cites','create')],cityControllers.create)
router.post('/store',[accessControlMiddleware('cites','create')],cityControllers.store)
router.get('/edit/:id',[accessControlMiddleware('cites','edit')],cityControllers.edit)
router.post('/update/:id',[accessControlMiddleware('cites','edit')],cityControllers.update)
router.get('/delete/:id',[accessControlMiddleware('cites','delete')],cityControllers.delete)

module.exports = router