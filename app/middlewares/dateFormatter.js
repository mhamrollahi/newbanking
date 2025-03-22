const dateService = require('@services/dateService');

const dateFormatter = (req, res, next) => {
  // Store original render function
  const originalRender = res.render;

  // Override render function
  res.render = function (view, options = {}, callback) {
    // If options is a function, it's the callback
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Format dates in the data object
    if (options && typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        if (options[key] && typeof options[key] === 'object') {
          // Check for createdAt and updatedAt fields
          if (options[key].createdAt) {
            options[key].fa_createdAt = dateService.toPersianDate(options[key].createdAt);
          }
          if (options[key].updatedAt) {
            options[key].fa_updatedAt = dateService.toPersianDate(options[key].updatedAt);
          }
        }
      });
    }

    // Call original render with modified options
    return originalRender.call(this, view, options, callback);
  };

  next();
};

module.exports = dateFormatter;
