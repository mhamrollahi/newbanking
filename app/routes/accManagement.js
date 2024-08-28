const express = require('express')
// const sql =require('app/configs')


const router = express.Router()

router.get('/block',(req,res)=>{res.render('./accManagement/blockingAcc')})
router.get('/',(req,res)=>{res.render('./accManagement/index')})

module.exports = router