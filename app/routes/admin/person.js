const express = require('express')
const personControllers = require('@controllers/admin/person')
const router = express.Router()

router.get('/api/getData',personControllers.getData)
// router.post('/api/updateUserActive/:id',peopleControllers.updateUserActive)

router.get('/index',personControllers.index)
router.get('/create',personControllers.create)
router.post('/store',personControllers.store)
router.get('/edit/:id',personControllers.edit)
router.post('/update/:id',personControllers.update)
router.get('/delete/:id',personControllers.delete)

module.exports = router