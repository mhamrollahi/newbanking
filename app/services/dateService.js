const jm = require('jalali-moment');

exports.toPersianDate = (date, format = 'YYYY/MM/DD') => {
  if (date != null) {
    return jm(date).locale('fa').format(format);
  }
  return null;
};

exports.toEnglishDate = (date, format = 'YYYY/MM/DD') => {
  if (!date || date.trim() === '') {
    return null;
  }

  try {
    // تبدیل اعداد فارسی به انگلیسی
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let englishValue = date;
    for (let i = 0; i < 10; i++) {
      englishValue = englishValue.replace(persianNumbers[i], englishNumbers[i]);
    }

    // بررسی فرمت تاریخ
    const dateParts = englishValue.split('/');
    if (dateParts.length !== 3) {
      console.error('Invalid date format:', date);
      return null;
    }

    const [year, month, day] = dateParts.map(Number);

    // بررسی معتبر بودن اعداد
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error('Invalid date numbers:', { year, month, day });
      return null;
    }

    // بررسی محدوده سال (مثلاً بین 1300 تا 1500)
    if (year < 1300 || year > 1500) {
      console.error('Year out of range:', year);
      return null;
    }

    // تبدیل تاریخ فارسی به میلادی
    const persianDate = jm(`${year}/${month}/${day}`, 'YYYY/MM/DD');
    const gregorianDate = persianDate.toDate();

    // بررسی معتبر بودن تاریخ نهایی
    if (isNaN(gregorianDate.getTime())) {
      console.error('Invalid gregorian date:', gregorianDate);
      return null;
    }

    console.log('Converting date:', {
      input: date,
      englishValue,
      year,
      month,
      day,
      persianDate: persianDate.format('YYYY/MM/DD'),
      gregorianDate
    });
    return gregorianDate;
  } catch (error) {
    console.error('Error converting date:', error);
    return null;
  }
};

// تابع بررسی معتبر بودن تاریخ فارسی
exports.isValidPersianDate = (date) => {
  if (!date || date.trim() === '') {
    return false;
  }

  try {
    // تبدیل اعداد فارسی به انگلیسی
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let englishValue = date;
    for (let i = 0; i < 10; i++) {
      englishValue = englishValue.replace(persianNumbers[i], englishNumbers[i]);
    }

    // بررسی فرمت تاریخ
    const dateParts = englishValue.split('/');
    if (dateParts.length !== 3) {
      return false;
    }

    const [year, month, day] = dateParts.map(Number);

    // بررسی معتبر بودن اعداد
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return false;
    }

    // بررسی محدوده سال
    if (year < 1300 || year > 1500) {
      return false;
    }

    // بررسی محدوده ماه و روز
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
