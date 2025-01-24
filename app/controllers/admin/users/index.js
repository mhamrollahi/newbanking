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

exports.create = async (req,res,next)=>{
  try {
    const errors = req.flash("errors");
    const success = req.flash("success");
    const hasError = errors.length > 0;

    res.render("./admin/user/create", {
      layout: "main",
      errors,
      hasError,
      success,
    });
  } catch (error) {
    next(error)
  }
}

exports.store = async (req,res,next)=>{
  try {
    const userData = {
      userName:'0059935261',
      password:'Mh@904957',
      fullName:'Mohammad Hassan Amrollahi',
      creator:'MHA',
    }
    const {id} = 
  } catch (error) {
    
    next(error)
  }
}