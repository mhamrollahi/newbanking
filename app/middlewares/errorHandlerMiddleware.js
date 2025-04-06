// const AppError = require('../errors/AppError');

// تعریف پیام‌های خطای unique برای هر فیلد
const uniqueErrorMessages = require('../constants/uniqueErrorMessages.js');

module.exports = (app) => {
  app.use((error, req, res, next) => {
    // خطای 404
    if (error.status === 404) {
      return res.status(404).redirect('/errors/404');
    }

    // خطاهای Sequelize Validation
    if (error.name === 'SequelizeValidationError') {
      req.flash(
        'errors',
        error.errors.map((e) => e.message)
      );
      return res.redirect('back');
    }

    // خطای تکراری بودن داده
    if (error.name === 'SequelizeUniqueConstraintError') {
      const uniqueError = error.errors[0];
      const errorKey = `${uniqueError.instance.constructor.name}.${uniqueError.path}`;
      
      const myError= error.message==='Validation error'?'این اطلاعات قبلا ثبت شده است':error.message;

      const errorMessage = uniqueErrorMessages[errorKey] || myError;
      //const errorMessage = error.message ;

      req.flash('errors', [errorMessage]);
      return res.redirect('back');
    }

    // خطای کلید خارجی
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      req.flash('removeSuccess', 'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
      return res.redirect('back');
    }

    // خطای اتصال به دیتابیس
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).send({
        code: 'DATABASE_CONNECTION_ERROR',
        status: 503,
        message: 'خطا در اتصال به پایگاه داده'
      });
    }

    // خطای JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({
        code: 'INVALID_TOKEN',
        status: 401,
        message: 'توکن نامعتبر است'
      });
    }

    // خطای منقضی شدن توکن
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({
        code: 'TOKEN_EXPIRED',
        status: 401,
        message: 'توکن منقضی شده است'
      });
    }

    // خطای دسترسی
    if (error.name === 'UnauthorizedError') {
      return res.status(403).send({
        code: 'UNAUTHORIZED',
        status: 403,
        message: 'شما دسترسی به این عملیات را ندارید'
      });
    }

    // خطاهای پیش‌بینی نشده
    console.error(error);
    return next(error)
    // req.flash('errors', ['خطای سیستمی رخ داده است']);
    // return res.redirect('back');
  });
};
