function setErrorMessage(inputElement,message){
  
  let errorMessage = document.createElement('span')
  errorMessage.className = 'errMessage'

  inputElement.parentNode.insertBefore(errorMessage,inputElement.nextSibling)

}

function validationForm(form) {

  const errorMessages = form.querySelectorAll('.errMessage')
  errorMessages.forEach(msg => msg.remove())

  let isValid = true

  Array.from(form.elements).forEach(input => {
    const value = input.value.trim()

    
  })

}

// // formValidation.js  

// function validateForm(event) {  
//   event.preventDefault(); // جلوگیری از ارسال فرم  
//   const form = event.target;  
//   const errorContainer = document.getElementById('errorMessages');  
//   errorContainer.innerHTML = ''; // پاک کردن خطاهای قبلی  

//   let isValid = true;  

//   // بررسی همه ورودی‌ها  
//   Array.from(form.elements).forEach(element => {  
//       // تنها ورودی‌های دارای ویژگی required را بررسی کنید  
//       if (element.hasAttribute('required') && !element.value) {  
//           isValid = false;  
//           element.setCustomValidity("این فیلد الزامی است.");  
//       } else if (element.validity.tooShort) {  
//           isValid = false;  
//           element.setCustomValidity(`طول ورودی باید حداقل ${element.minLength} کاراکتر باشد.`);  
//       } else if (element.validity.tooLong) {  
//           isValid = false;  
//           element.setCustomValidity(`طول ورودی نباید بیشتر از ${element.maxLength} کاراکتر باشد.`);  
//       } else if (element.validity.typeMismatch) {  
//           if (element.type === "email") {  
//               isValid = false;  
//               element.setCustomValidity("ایمیل معتبر نیست.");  
//           }  
//       } else if (element.type === "file") {  
//           const allowedExtensions = /(\.xls|\.xlsx)$/;  
//           if (element.files.length === 0) {  
//               isValid = false;  
//               element.setCustomValidity("بارگذاری فایل اکسل اجباری است.");  
//           } else if (!allowedExtensions.exec(element.value)) {  
//               isValid = false;  
//               element.setCustomValidity("لطفا یک فایل اکسل معتبری انتخاب کنید (.xls یا .xlsx).");  
//           }  
//       } else {  
//           element.setCustomValidity(""); // پاک کردن خطا  
//       }  
//   });  

//   // اگر همه اعتبارسنجی‌ها درست بود، فرم را ارسال کنید  
//   if (isValid) {  
//       alert("فرم به درستی اعتبارسنجی شد.");  
//       form.submit(); // ارسال فرم  
//   }  

//   // نمایش خطاها در صفحه  
//   displayErrorMessages(form);  
// }  

// function displayErrorMessages(form) {  
//   const errorContainer = document.getElementById('errorMessages');  
//   errorContainer.innerHTML = '';  

//   // بررسی و نمایش خطاها  
//   Array.from(form.elements).forEach(element => {  
//       if (!element.validity.valid) {  
//           const errorElement = document.createElement('div');  
//           errorElement.className = 'error';  
//           errorElement.textContent = element.validationMessage; // پیام خطا  
//           errorContainer.appendChild(errorElement);  
//       }  
//   });  
// }  

// // ثبت رویداد ارسال فرم  
// document.getElementById('myForm').onsubmit = validateForm;



// این کد بهتررررر
// // formValidation.js  

// // تابع برای ارائه پیغام خطا  
// function setErrorMessage(inputElement, message) {  
//   // ایجاد یک عنصر span برای نمایش پیام خطا  
//   let errorMessage = document.createElement('span');  
//   errorMessage.className = 'error-message';  
//   errorMessage.style.color = 'red';  
//   errorMessage.innerText = message;  
  
//   // اضافه کردن پیام به فرم  
//   inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);  
// }  

// // تابع اعتبارسنجی  
// function validateForm(form) {  
//   // پاک کردن پیام‌های خطای قبلی  
//   const errorMessages = form.querySelectorAll('.error-message');  
//   errorMessages.forEach(msg => msg.remove());  

//   let isValid = true;  

//   // بررسی ورودی‌ها  
//   Array.from(form.elements).forEach(input => {  
//       const value = input.value.trim();  

//       // اعتبارسنجی الزامی بودن  
//       if (input.required && !value) {  
//           setErrorMessage(input, 'این فیلد الزامی است.');  
//           isValid = false;  
//           return; // ادامه به ورودی بعدی  
//       }  

//       // اعتبارسنجی نوع ایمیل  
//       if (input.type === 'email' && value && !value.includes('@')) {  
//           setErrorMessage(input, 'ایمیل معتبر نیست.');  
//           isValid = false;  
//           return;  
//       }  

//       // اعتبارسنجی طول ورودی (برای نوع text و password)  
//       if ((input.type === 'text' || input.type === 'password') && value) {  
//           const minLength = input.minLength ? parseInt(input.minLength) : 0;  
//           const maxLength = input.maxLength ? parseInt(input.maxLength) : Infinity;  

//           if (value.length < minLength) {  
//               setErrorMessage(input, `حداقل طول ورودی ${minLength} کاراکتر است.`);  
//               isValid = false;  
//               return;  
//           }  
//           if (value.length > maxLength) {  
//               setErrorMessage(input, `حداکثر طول ورودی ${maxLength} کاراکتر است.`);  
//               isValid = false;  
//               return;  
//           }  
//       }  

//       // اعتبارسنجی ورودی فایل  
//       if (input.type === 'file') {  
//           const allowedExtensions = /(\.xlsx|\.xls)$/i; // فقط فایل‌های Excel  
//           if (!allowedExtensions.exec(input.value)) {  
//               setErrorMessage(input, 'فقط فایل‌های Excel با پسوند .xlsx یا .xls مجاز هستند.');  
//               isValid = false;  
//               return;  
//           } else if (input.files[0] && input.files[0].size > 5 * 1024 * 1024) { // حداکثر اندازه فایل ۵ مگابایت  
//               setErrorMessage(input, 'حجم فایل باید کمتر از ۵ مگابایت باشد.');  
//               isValid = false;  
//               return;  
//           }  
//       }  
//   });  

//   return isValid;  
// }  

// // افزودن رویداد به فرم‌ها  
// document.querySelectorAll('form').forEach(form => {  
//   form.addEventListener('submit', function (event) {  
//       const isValid = validateForm(form);  
//       if (!isValid) {  
//           event.preventDefault(); // جلوگیری از ارسال فرم  
//       }  
//   });  
// });

