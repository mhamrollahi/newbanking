$(document).ready(function () {
  // این کد برای همه فرم‌ها کار می‌کند
  $('form').each(function () {
    // پیدا کردن همه فیلدهای ورودی و select در فرم
    const formFields = $(this).find('input, select');

    // برای هر فیلد، رویداد keydown را اضافه می‌کنیم
    formFields.each(function (index) {
      $(this).on('keydown', function (e) {
        if (e.key === 'Tab' && !e.shiftKey) {
          // اگر فیلد بعدی select است و Select2 دارد
          const nextField = formFields.eq(index + 1);
          if (nextField.is('select') && nextField.hasClass('select2-hidden-accessible')) {
            e.preventDefault();
            nextField.select2('open');
          }
        }
      });
    });
  });
});
