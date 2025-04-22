module.exports = (app) => {
  app.use((req, res, next) => {
    if (!res.headersSent && !req.originalUrl.startsWith('/errors')) {
      const error = new Error('صفحه مورد نظر یافت نشد');
      error.status = 404;
      next(error);
    } else {
      next();
    }
  });
};
