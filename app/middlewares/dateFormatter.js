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
          // Check for common date fields
          const dateFields = ['createdAt', 'updatedAt', 'requestLetterDate', 'openDate', 'requestObstructDate', 'registerDate', 'birthDate', 'expiryDate'];

          dateFields.forEach((field) => {
            if (options[key][field]) {
              options[key][`fa_${field}`] = dateService.toPersianDate(options[key][field]);
            }
          });
        }
      });
    }

    // Call original render with modified options
    return originalRender.call(this, view, options, callback);
  };

  next();
};

module.exports = dateFormatter;
