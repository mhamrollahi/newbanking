const express = require('express')
// const mydb = require('../configs/dbConfig')
// const sql =require('app/configs')


const router = express.Router()

router.get('/block',(req,res)=>{res.render('./accManagement/blockingAcc')})
router.get('/',(req,res)=>{
  // const result
  // result =async mydb.query(`SELECT * FROM codetablelist`)
  // console.log(result)
  res.render('./accManagement/index')
})

module.exports = router