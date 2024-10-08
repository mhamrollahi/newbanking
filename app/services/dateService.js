const jm = require('jalali-moment')


exports.toPersianDate = (date,format='YYYY/MM/DD') => {
  if(date != null){
    return jm(date).locale('fa').format(format)
  }
  return null
}

