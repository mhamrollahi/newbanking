const express = require('express')
const accManagementControllers = require('@controllers/accManagement')
const router = express.Router()

router.get('/block',accManagementControllers.block)
router.get('/',(req,res)=>{res.render('./accManagement/index')})

module.exports = router