const logger = require('../logger/logger');
// const AppError = require('../errors/AppError');

// تعریف پیام‌های خطای unique برای هر فیلد
const uniqueErrorMessages = require('../constants/uniqueErrorMessages.js');

module.exports = (app) => {
  app.use((error, req, res, next) => {
    // خطای 404
    if (error.status === 404) {
      logger.warn(`404 Error: ${error.message}`);
      return res.status(404).redirect('/errors/404');
    }

    // خطاهای Sequelize Validation
    if (error.name === 'SequelizeValidationError') {
      logger.warn(`Validation Error: ${error.errors.map((e) => e.message).join(', ')}`);
      req.flash(
        'errors',
        error.errors.map((e) => e.message)
      );
      return res.redirect('back');
    }

    // خطای تکراری بودن داده
    if (error.name === 'SequelizeUniqueConstraintError') {
      const uniqueError = error.errors[0];

      // اگر instance نال باشه، از model name استفاده می‌کنیم
      // const modelName = uniqueError?.instance?.constructor?.name || uniqueError?.model?.name || 'Unknown';
      const errorKey = `${uniqueError?.path}`;

      const myError = error.message === 'Validation error' ? 'این اطلاعات قبلا ثبت شده است' : error.message;
      const errorMessage = uniqueErrorMessages[errorKey] || myError;

      logger.warn(`Unique Constraint Error: ${errorMessage}`);
      req.flash('errors', [errorMessage]);
      return res.redirect('back');
    }

    // خطای کلید خارجی
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      logger.warn(`Foreign Key Constraint Error: ${error.message}`);
      req.flash('removeSuccess', 'این اطلاعات در جایی دیگر استفاده شده و امکان حذف آن نیست !!!');
      return res.redirect('back');
    }

    // خطای اتصال به دیتابیس
    if (error.name === 'SequelizeConnectionError') {
      logger.error(`Database Connection Error: ${error.message}`);
      return res.status(503).send({
        code: 'DATABASE_CONNECTION_ERROR',
        status: 503,
        message: 'خطا در اتصال به پایگاه داده'
      });
    }

    // خطای JWT
    if (error.name === 'JsonWebTokenError') {
      logger.warn(`JWT Error: ${error.message}`);
      return res.status(401).send({
        code: 'INVALID_TOKEN',
        status: 401,
        message: 'توکن نامعتبر است'
      });
    }

    // خطای منقضی شدن توکن
    if (error.name === 'TokenExpiredError') {
      logger.warn(`Token Expired Error: ${error.message}`);
      return res.status(401).send({
        code: 'TOKEN_EXPIRED',
        status: 401,
        message: 'توکن منقضی شده است'
      });
    }

    // خطای دسترسی
    if (error.name === 'UnauthorizedError') {
      logger.warn(`Unauthorized Error: ${error.message}`);
      return res.status(403).send({
        code: 'UNAUTHORIZED',
        status: 403,
        message: 'شما دسترسی به این عملیات را ندارید'
      });
    }

    // خطاهای پیش‌بینی نشده
    logger.error(`Unexpected Error: ${error.message}`, { error });
    return next(error);
  });
};
