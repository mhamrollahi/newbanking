const express = require('express')
const router = express.Router()

const codeTableListControllers = require('@controllers/baseInformation/codeTableList')

const accessControlMiddleware = require('@middlewares/accessControlMiddleware')

router.get('/codeTableList/api/getData',[accessControlMiddleware('codeTableLists','read')],codeTableListControllers.getData)

router.get('/codeTableList/index',[accessControlMiddleware('codeTableLists','read')],codeTableListControllers.index)
router.get('/codeTableList/create',[accessControlMiddleware('codeTableLists','create')],codeTableListControllers.create)
router.post('/codeTableList/store',[accessControlMiddleware('codeTableLists','cerate')],codeTableListControllers.store)
router.get('/codeTableList/edit/:id',[accessControlMiddleware('codeTableLists','edit')],codeTableListControllers.edit)
router.post('/codeTableList/update/:id',[accessControlMiddleware('codeTableLists','edit')],codeTableListControllers.update)
router.get('/codeTableList/delete/:id',[accessControlMiddleware('codeTableLists','delete')],codeTableListControllers.delete)


module.exports = router