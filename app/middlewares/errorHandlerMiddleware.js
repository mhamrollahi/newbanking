// const AppError = require('../errors/AppError');

module.exports = (app) => {
  app.use((error, req, res, next) => {
    // خطای 404
    if (error.status === 404) {
      return res.status(404).send({
        code: 'Not found',
        status: 404,
        message: 'درخواست مورد نظر یافت نشد'
      });
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
      req.flash('errors', ['این اطلاعات قبلاً ثبت شده است']);
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
    req.flash('errors', ['خطای سیستمی رخ داده است']);
    return res.redirect('back');
  });
};
