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

    // برای هر select2، رویدادهای مختلف را اضافه می‌کنیم
    $('.select2-hidden-accessible').each(function () {
      const currentSelect = $(this);

      // وقتی select2 فوکوس می‌شود
      currentSelect.on('focus', function () {
        setTimeout(function () {
          currentSelect.select2('open');
        }, 0);
      });

      // وقتی select2 بسته می‌شود
      currentSelect.on('select2:close', function () {
        handleNextField(currentSelect);
      });

      // وقتی یک گزینه انتخاب می‌شود
      currentSelect.on('select2:select', function () {
        handleNextField(currentSelect);
      });
    });

    // تابع کمکی برای مدیریت فیلد بعدی
    function handleNextField(currentField) {
      const currentIndex = formFields.index(currentField);
      const nextField = formFields.eq(currentIndex + 1);

      if (nextField.is('select') && nextField.hasClass('select2-hidden-accessible')) {
        setTimeout(function () {
          nextField.select2('open');
        }, 0);
      } else if (nextField.length) {
        setTimeout(function () {
          nextField.focus();
        }, 0);
      }
    }
  });
});
