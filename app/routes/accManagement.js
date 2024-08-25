const express = require('express')

const router = express.Router()

router.get('/block',(req,res)=>{
  res.render('./accManagement/blockingAcc')
})

module.exports = router