const dateService = require('@services/dateService')
const {UserModel} = require('@models/')

exports.getData = async(req,res,next)=>{
  try {
    const result = await UserModel.findAll({})
    console.log(result)
    
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
      title:'مدیریت کاربران سیستم',
      subTitle:'جدید',
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
      userName:req.body.userName,
      password:req.body.password,
      fullName:req.body.fullName,
      creator:'MHA',
    }
    console.log(userData)

    const {id} = await UserModel.create(userData)
    if(id){
      req.flash('success','اطلاعات کاربر با موفقیت ثبت شد.')
      return res.redirect('./index')
    }
  } catch (error) {
    let errors = [];

    if (error.name === "SequelizeValidationError") {
      errors = error.message.split("Validation error:");
      req.flash("errors", errors);
      return res.redirect(`./create`);
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(error.message);

      errors = error.message.split("SequelizeUniqueConstraintError");
      req.flash("errors", errors);
      return res.redirect(`./create`);
    }
    next(error)
  }
}