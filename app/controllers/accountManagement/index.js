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

