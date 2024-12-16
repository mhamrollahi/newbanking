const express = require('express')
const router = express.Router()

const codeTableListControllers = require('@controllers/baseInformation/codeTableList')

router.get('/codeTableList/api/getData',codeTableListControllers.test1)

router.get('/codeTableList/index',codeTableListControllers.index)
router.get('/codeTableList/create',codeTableListControllers.create)
router.post('/codeTableList/store',codeTableListControllers.store)
router.get('/codeTableList/edit/:id',codeTableListControllers.edit)
router.post('/codeTableList/update/:id',codeTableListControllers.update)
router.get('/codeTableList/delete/:id',codeTableListControllers.delete)


module.exports = router