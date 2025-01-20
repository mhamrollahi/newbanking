exports.getData = async(req,res,next)=>{
  try {
    const result = null
    res.json(result)
  } catch (error) {
    next(error)
  }
}

exports.index = async(req,res,next) => {
  try {
    res.render('./admin/user/index',{
      layout:'main',
      title:'مدیریت کاربران سیستم',
      subTitle:'فهرست کاربران'
    })
    
  } catch (error) {
   next(error) 
  }
}