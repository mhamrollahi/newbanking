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
