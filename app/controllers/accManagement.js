const accManagementModel = require('@models/accManagement')

exports.block = async (req,res,next)=>{
  try {
    const result = await accManagementModel.block()
    res.send(result)
  } catch (error) {
    next(error)
  }
}