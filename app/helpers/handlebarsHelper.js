const jm = require('jalali-moment');

module.exports = {
  // مقایسه دو مقدار برای select options
  isSelected: function (currentId, selectedId) {
    return currentId == selectedId ? 'selected' : '';
  },

  // مقایسه دو مقدار برای checkbox
  isChecked: function (currentValue, checkedValue) {
    return currentValue == checkedValue ? 'checked' : '';
  },

  // تبدیل تاریخ میلادی به شمسی
  toPersianDate: function (date) {
    // return moment(date).format('jYYYY/jMM/jDD');
    return jm(date).locale('fa').format('YYYY/MM/DD')
  },

  // تبدیل عدد به فرمت پولی
  toCurrency: function (number) {
    return new Intl.NumberFormat('fa-IR').format(number);
  },

  // مقایسه دو مقدار برای نمایش شرطی
  eq: function (a, b) {
    return a == b;
  },

  // مقایسه دو مقدار برای نمایش شرطی (نابرابر)
  neq: function (a, b) {
    return a != b;
  },

  // مقایسه بزرگتر
  gt: function (a, b) {
    return a > b;
  },

  // مقایسه کوچکتر
  lt: function (a, b) {
    return a < b;
  },

  // تبدیل متن به حروف کوچک
  toLowerCase: function (text) {
    return text.toLowerCase();
  },

  // تبدیل متن به حروف بزرگ
  toUpperCase: function (text) {
    return text.toUpperCase();
  },

  // بررسی خالی بودن
  isEmpty: function (value) {
    return !value || value.length === 0;
  },

  // بررسی پر بودن
  isNotEmpty: function (value) {
    return value && value.length > 0;
  },

  // جمع دو عدد
  add: function (a, b) {
    return a + b;
  },

  // تفریق دو عدد
  subtract: function (a, b) {
    return a - b;
  },

  // ضرب دو عدد
  multiply: function (a, b) {
    return a * b;
  },

  // تقسیم دو عدد
  divide: function (a, b) {
    return a / b;
  },

  // نمایش وضعیت به صورت متن
  statusText: function (status) {
    const statusMap = {
      active: 'فعال',
      inactive: 'غیرفعال',
      pending: 'در انتظار',
      approved: 'تایید شده',
      rejected: 'رد شده'
    };
    return statusMap[status] || status;
  }
};
