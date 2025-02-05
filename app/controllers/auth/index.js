const authService = require('@services/authService')

exports.login = async (req,res,next)=>{
  try {
    const success = req.flash('success')
    const removeSuccess = req.flash('removeSuccess')

    res.render('./auth/login', {
      layout: 'auth',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست کاربران',
      success,
      removeSuccess,
    });
  } catch (error) {
    next(error);
  }
}

exports.doLogin = async (req,res,next)=>{

  const {userName,password} = req.body
  const user = await authService.login(userName,password)
  if (!user) {
    req.flash('success','نام کاربری یا کلمه عبور معتبر نیست')
    return res.redirect('/auth/login')
  }

  return res.redirect('../accManagement/index')

};

