const express = require('express')
const accManagementModel = require('@models/accManagement')

const router = express.Router()

router.get('/block',async (req,res,next) => {
  try {
    const result = await accManagementModel.block()
    res.send(result)
  } catch (error) {
    next(error)
  }

})


router.get('/',(req,res)=>{res.render('./accManagement/index')})

module.exports = router