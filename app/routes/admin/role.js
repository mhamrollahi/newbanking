const express = require('express')
const roleControllers = require('@controllers/admin/role')
const router = express.Router()

router.get('/api/getData',roleControllers.getData)

router.get('/index',roleControllers.index)
router.get('/create',roleControllers.create)
router.post('/store',roleControllers.store)
router.get('/edit/:id',roleControllers.edit)
router.post('/update/:id',roleControllers.update)
router.get('/delete/:id',roleControllers.delete)

module.exports = router