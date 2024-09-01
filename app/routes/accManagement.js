const express = require('express')
const {executeQuery} = require('../configs/dbConfig')

const router = express.Router()

router.get('/block',async (req,res,next)=>{
  try {
    const query = 'SELECT * FROM BG_CodeTableList'
    const result = await executeQuery(query)
    res.send(result.recordset)
    
  } catch (error) {
    console.log(error)
    next()
    // res.status(500).send('Internal Server error ')    
  }

  // res.render('./accManagement/blockingAcc')

})


router.get('/',(req,res)=>{res.render('./accManagement/index')})

module.exports = router