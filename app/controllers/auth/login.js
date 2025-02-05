exports.login = async (req,res,next)=>{
  try {
    const success = req.flash('success')
    const removeSuccess = req.flash('removeSuccess')

    res.render('./auth/login', {
      layout: 'main',
      title: 'مدیریت کاربران سیستم',
      subTitle: 'فهرست کاربران',
      success,
      removeSuccess,
    });
  } catch (error) {
    next(error);
  }
}