const jm = require('jalali-moment')


exports.toPersianDate = (date,format='YYYY/MM/DD') => {
  return jm(date).locale('fa').format(format)
}

