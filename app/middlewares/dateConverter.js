const dateService = require('@services/dateService');

const dateConverter = (req, res, next) => {
  // تبدیل تاریخ‌های فارسی در body به انگلیسی
  if (req.body) {
    const dateFields = ['requestLetterDate', 'openDate', 'requestObstructDate', 'registerDate', 'birthDate', 'expiryDate'];

    dateFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        const convertedDate = dateService.toEnglishDate(req.body[field]);
        if (convertedDate) {
          req.body[field] = convertedDate;
        }
      }
    });
  }

  // تبدیل تاریخ‌های فارسی در query parameters به انگلیسی
  if (req.query) {
    const dateFields = ['requestLetterDate', 'openDate', 'requestObstructDate', 'registerDate', 'birthDate', 'expiryDate'];

    dateFields.forEach((field) => {
      if (req.query[field] && typeof req.query[field] === 'string') {
        const convertedDate = dateService.toEnglishDate(req.query[field]);
        if (convertedDate) {
          req.query[field] = convertedDate;
        }
      }
    });
  }

  next();
};

module.exports = dateConverter;
