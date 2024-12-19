const accManagementModel = require('@models/accManagement')

exports.index = async(req,res,next) => {
  try {
    res.render('./accManagement/index',{
      layout:'main',
      title:'مدیریت حساب',
      subTitle:'فهرست حساب'
    })
    
  } catch (error) {
   next(error) 
  }
}

exports.block = async (req,res,next)=>{
  try {
    const result = await accManagementModel.block()
    res.send(result)
  } catch (error) {
    next(error)
  }
}

