module.exports = (app) => {
  app.use(async (req, res, next) => {
    const errors = req.flash('errors');
    const success = req.flash('success');
    const hasError = errors.length > 0;
    const removeSuccess = req.flash('removeSuccess');

    let user = null;

    if ('user' in req.session) {
      user = req.session?.user;
    }
    // res.locals.menuState = req.session.menuState || {};

    res.adminRender = (template, options) => {
      options = {
        ...options,
        layout: 'main',
        errors,
        success,
        hasError,
        removeSuccess,
        user,
        userPermissionLists:req.session.permissions,
        menuState: req.session.menuState || {},
      };

      res.render(template, options);
    };

    res.authRender = (template, options) => { 
      options = {
        ...options,
        layout: 'auth',
        errors,
        success,
        hasError,
        removeSuccess,
      };

      res.render(template, options);
    }

    next();
  });
};
