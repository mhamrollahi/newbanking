// const accManagementModel = require('@models/accountManagement')

exports.index = async(req,res,next) => {
  try {
    res.adminRender('./accManagement/index',{
      title:'مدیریت حساب',
      subTitle:'فهرست حساب'
    })
    
  } catch (error) {
   next(error) 
  }
}

// exports.block = async (req,res,next)=>{
//   try {
//     const result = await accManagementModel.block()
//     res.send(result)
//   } catch (error) {
//     next(error)
//   }
// }

