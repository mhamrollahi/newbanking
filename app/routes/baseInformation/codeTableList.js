const express = require('express')
const router = express.Router()

const codeTableListControllers = require('@controllers/baseInformation/codeTableList')

console.log('in codeTableList routers ... ')

router.get('/codeTableList/index',codeTableListControllers.index)
router.get('/codeTableList/create',codeTableListControllers.create)
router.post('/codeTableList/store',codeTableListControllers.store)
router.get('/codeTableList/edit/:id',codeTableListControllers.edit)

module.exports = router