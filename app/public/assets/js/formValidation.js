const frm = document.querySelector('[data-frmValidation]')
let errorMessage = document.createElement("div");
errorMessage.classList.add("errMessage");

const errMessages = {
  badInput : () => 'badInput',
  customError : () => 'customError',
  patternMismatch : (target) =>  'فرمت وارد شده اشتباه می‌باشد.',
  rangeOverflow :(target) => `${target.dataset.farsiname} باید کوچکتر از   ${target.max}.`,
  rangeUnderflow : (target) => `${target.dataset.farsiname} باید بزرگتر از   ${target.min}.` ,
  stepMismatch : () => 'stepMismatch',
  tooLong : (target) => `حداکثر تعداد ${target.maxLength} کاراکتر را باید وارد کنید!` ,
  tooShort :(target) => `حداقل تعداد ${target.minLength} کاراکتر را باید وارد کنید!` ,
  typeMismatch : (target)=> `فرمت ${target.dataset.farsiname} نادرست می‌باشد.` ,
  // valid : () => 'valid',
  valueMissing : () => 'مقدار مورد نظر اجباری می‌باشد.',
}

frm.addEventListener('input',(e)=>{showErrors(e)})
const validityKeys = Object.keys(errMessages)

function showErrors(e){
  const {target} = e

  const errorsEL = target.parentElement.querySelectorAll('.errMessage')
  errorsEL.forEach(el => {
    el.remove()
  })

  validityKeys.forEach(key => {
    if(target.validity[key]){
      appendError(target,key)
    }
  })
}

function appendError(target,key){
  const errorEL = document.createElement('div')
  errorEL.innerText = errMessages[key](target)
  errorEL.classList.add('errMessage')
  target.parentElement.appendChild(errorEL)
}

function appendError2(target,message){
  const errorEL = document.createElement('div')
  errorEL.innerText = message
  errorEL.classList.add('errMessage')
  target.parentElement.appendChild(errorEL)
}

//اعتبار سنجی در موقع ارسال فرم ... 

frm.addEventListener("submit", function (event) {
// document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // جلوگیری از ارسال فرم

  const form = event.target;
  const inputs = form.querySelectorAll("input");
  let isValid = true;

  // پاک کردن پیام‌های خطای قبلی
  form.querySelectorAll(".errMessage").forEach(error => error.remove());

  inputs.forEach(input => {
    if (input.type === "file") {
      // بررسی فایل
      const file = input.files[0];
      if (!file) {
        isValid = false;
        appendError2(input,"لطفاً یک فایل انتخاب کنید.")
      } else {
        // بررسی نوع فایل
        const validTypes = [".xls", ".xlsx"];
        const fileName = file.name.toLowerCase();
        const isTypeValid = validTypes.some(type => fileName.endsWith(type));
        if (!isTypeValid) {
          isValid = false;
          appendError2(input,"فقط فایل‌های اکسل (.xls یا .xlsx) مجاز هستند.")
        }

        // بررسی سایز فایل
        const maxSize = 5 * 1024 * 1024; // ۵ مگابایت
        if (file.size > maxSize) {
          isValid = false;
          appendError2(input,"حجم فایل نباید بیشتر از ۵ مگابایت باشد.")
        }
      }
    } else if (!input.checkValidity()) {
      // اعتبارسنجی سایر فیلدها
      isValid = false;

      if (input.validity.valueMissing) {
        appendError(input,'valueMissing')
      } else if (input.validity.typeMismatch && input.type === "email") {
        appendError(input,'typeMismatch')
      } else if (input.validity.tooShort) {
        appendError(input,'tooShort')
        // errorMessage.textContent = `طول این فیلد باید حداقل ${input.minLength} کاراکتر باشد.`;
      }

      input.parentNode.appendChild(errorMessage);
    }
  });

  // اگر فرم معتبر بود، ارسال
  if (isValid) {
    alert("فرم با موفقیت ارسال شد!");
    form.submit();
  }
});
