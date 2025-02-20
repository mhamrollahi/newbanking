const express = require('express')
const personControllers = require('@controllers/admin/person')
const router = express.Router()

// router.get('/api/getData',peopleControllers.getData)
// router.post('/api/updateUserActive/:id',peopleControllers.updateUserActive)

// router.get('/index',peopleControllers.index)
router.get('/create',personControllers.create)
// router.post('/store',peopleControllers.store)
// router.get('/edit/:id',peopleControllers.edit)
// router.post('/update/:id',peopleControllers.update)
// router.get('/delete/:id',peopleControllers.delete)

module.exports = router