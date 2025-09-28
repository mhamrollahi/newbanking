exports.error403 = async (req, res, next) => {
  try {
    res.adminRender('./errors/error_400', {
      title:'403',
      message:'به نظر می‌رسد دسترسی شما به این صفحه مقدور نمی‌باشد؛ لطفا با مدیر سیستم تماس بگیرد.'
    })
  } catch (error) {
    next(error);    
  }

}
exports.error404 = async (req, res, next) => {
  try {
    res.adminRender('./errors/error_400', {
      title:'404',
      message:'صفحه مورد نظر یافت نشد؛ لطفا با مدیر سیستم تماس بگیرد'
    })
  } catch (error) {
    next(error);    
  }

}