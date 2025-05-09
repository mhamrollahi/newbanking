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

    // تبدیل تاریخ فارسی به میلادی
    const [year, month, day] = englishValue.split('/').map(Number);
    const persianDate = jm(`${year}/${month}/${day}`, 'YYYY/MM/DD');
    const gregorianDate = persianDate.toDate();
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
