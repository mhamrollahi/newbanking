/* global toastr */
let progressInterval = null;
let currentImportId = null;
let isImportCompleted = false;
// این فایل برای مدیریت پیشرفت بارگذاری داده‌ها در فرم importCodingData استفاده می‌شود
// این فایل باید در صفحه importCodingData.html لود شود

// تست لود شدن فایل
console.log('importData_Progressbar.js loaded');

function startProgressTracking(importId) {
  currentImportId = importId || null;
  isImportCompleted = false;
  console.log('Starting progress tracking');

  const progressText = document.getElementById('progress-text');
  const progressBar = document.querySelector('.progress');
  const progressBarInner = document.querySelector('#progress-bar');

  if (!progressText || !progressBar || !progressBarInner) {
    console.error('Progress elements not found!');
    return;
  }

  // نمایش و تنظیم اولیه نوار پیشرفت
  progressBar.style.display = 'block';
  progressText.style.display = 'block';
  progressText.textContent = 'در حال شروع پردازش...';
  progressText.style.color = '#0056b3';

  // تنظیم مقدار اولیه progress bar
  progressBarInner.style.width = '0%';
  progressBarInner.setAttribute('aria-valuenow', 0);
  progressBarInner.textContent = '0%';
  progressBarInner.style.transition = 'width 0.5s ease-in-out';
  progressBarInner.style.backgroundColor = '#0056b3';

  // پاکسازی interval قبلی اگر وجود داشته باشد
  stopProgressTracking();

  let failedAttempts = 0;
  const maxFailedAttempts = 5;

  // شروع چک کردن وضعیت پیشرفت
  checkProgress(progressText);
  progressInterval = setInterval(async () => {
    if (isImportCompleted) {
      console.log('Import is completed, stopping interval');
      stopProgressTracking();
      return;
    }

    try {
      await checkProgress(progressText);
    } catch (error) {
      console.error('Error in progress check:', error);
      failedAttempts++;

      if (failedAttempts >= maxFailedAttempts) {
        console.log('Max failed attempts reached, stopping progress tracking');
        stopProgressTracking();
        progressText.textContent = 'خطا در دریافت وضعیت پردازش';
        progressText.style.color = '#dc3545';

        // فعال کردن مجدد دکمه submit
        const submitButton = document.querySelector('button[type="submit"]');
        enableSubmitButton(submitButton);
      }
    }
  }, 500);
}

// تابع جدید برای توقف پیگیری پیشرفت
function stopProgressTracking() {
  if (progressInterval) {
    console.log('Clearing progress interval');
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

async function checkProgress(progressText) {
  // اگر عملیات قبلاً تکمیل شده، درخواست جدید نفرست
  if (isImportCompleted) {
    console.log('Import already completed, skipping progress check');
    return;
  }

  const response = await fetch(`/importFiles/getImportProgress?importId=${currentImportId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Progress data received:', data);

  // اگر عملیات تکمیل شده، همه چیز را متوقف کن
  if (data.isCompleted || data.status === 'completed') {
    console.log('Server reported completion, stopping progress tracking');
    isImportCompleted = true;
    stopProgressTracking();

    const progressBar = document.querySelector('#progress-bar');
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.setAttribute('aria-valuenow', 100);
      progressBar.textContent = '100%';
      progressBar.style.backgroundColor = '#28a745';
    }

    progressText.textContent = `عملیات با موفقیت انجام شد (${data.current} از ${data.total} رکورد)`;
    progressText.style.color = '#28a745';

    // نمایش پیام موفقیت
    toastr.success('عملیات با موفقیت انجام شد', 'موفق');

    // فعال کردن مجدد دکمه submit
    const submitButton = document.querySelector('button[type="submit"]');
    enableSubmitButton(submitButton);

    return;
  }

  // به‌روزرسانی progress bar
  const progressBar = document.querySelector('#progress-bar');
  if (progressBar && data.total > 0) {
    const percent = Math.round((data.current / data.total) * 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = `${percent}%`;

    // تنظیم رنگ progress bar بر اساس وضعیت
    if (data.status === 'error') {
      progressBar.style.backgroundColor = '#dc3545'; // قرمز
    } else if (data.phase === 'validating') {
      progressBar.style.backgroundColor = '#17a2b8'; // آبی روشن
    } else {
      progressBar.style.backgroundColor = '#0056b3'; // آبی تیره
    }
  }

  // نمایش پیام متناسب با مرحله
  if (data.phase === 'validating') {
    progressText.textContent = `در حال اعتبارسنجی داده‌ها... (${data.current} از ${data.total} رکورد)`;
    progressText.style.color = '#0056b3';
  } else if (data.phase === 'importing') {
    if (data.status === 'error') {
      console.log('Import error, stopping progress tracking');
      isImportCompleted = true;
      stopProgressTracking();

      progressText.textContent = 'خطا در پردازش فایل';
      progressText.style.color = '#dc3545';

      // نمایش پیام خطا
      toastr.error('خطا در پردازش فایل', 'خطا');

      // فعال کردن مجدد دکمه submit
      const submitButton = document.querySelector('button[type="submit"]');
      enableSubmitButton(submitButton);

      return;
    } else {
      progressText.textContent = `در حال ذخیره‌سازی... (${data.current} از ${data.total} رکورد)`;
      progressText.style.color = '#0056b3';
    }
  }
}

// اضافه کردن event listener به فرم
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM Content Loaded - Checking form...');
  const form = document.getElementById('frmImportCodingData');
  if (!form) {
    console.error('Form not found! Make sure the form has id="frmImportCodingData"');
    return;
  }

  // اضافه کردن ویژگی novalidate به فرم
  form.setAttribute('novalidate', '');

  form.addEventListener('submit', async function (e) {
    // جلوگیری از رفتار پیش‌فرض فرم
    e.preventDefault();
    e.stopPropagation();

    console.log('Form submitted');

    // غیرفعال کردن دکمه submit
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>در حال پردازش...';
    }

    const formData = new FormData(this);
    const tableName = formData.get('tableName');
    const excelFile = formData.get('excelFile');

    if (!tableName) {
      alert('لطفا جدول را انتخاب کنید');
      enableSubmitButton(submitButton);
      return false;
    }

    if (!excelFile || excelFile.size === 0) {
      alert('لطفا فایل اکسل را انتخاب کنید');
      enableSubmitButton(submitButton);
      return false;
    }

    // حذف پیام خطای قبلی اگر وجود داشت
    const existingError = document.querySelector('.import-error-message');
    if (existingError) {
      existingError.remove();
    }

    // نمایش اولیه پیشرفت
    const progressText = document.getElementById('progress-text');
    const progressBar = document.querySelector('.progress');

    if (progressText && progressBar) {
      progressText.style.display = 'block';
      progressBar.style.display = 'block';
      progressText.textContent = 'در حال شروع پردازش...';
    }

    try {
      console.log('Sending request to server...');
      const response = await fetch('/importFiles/importCodingData', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!result.success) {
        console.log('Error occurred. Displaying error message...');
        // پنهان کردن نوار پیشرفت
        if (progressBar) progressBar.style.display = 'none';
        if (progressText) progressText.style.display = 'none';

        // نمایش پیام خطا
        const errorDiv = document.createElement('div');
        errorDiv.className = 'col-12 w-100 d-flex justify-content-center mt-1 mb-1 flex-column import-error-message';

        let errorHtml = `
          <div class='alert alert-danger w-100 text-center' style='font-size: 18px;color:#01019e;'>
            <div class="mb-3">
              <i class="fas fa-exclamation-triangle me-1"></i>
              ${result.message}
            </div>
        `;

        // اگر فایل خطا وجود دارد، لینک دانلود را اضافه کن
        if (result.errorFilePath) {
          console.log('Adding error file download link:', result.errorFilePath);
          errorHtml += `
            <div>
              <p class="mb-2">جهت مشاهده جزئیات خطاها، فایل زیر را دانلود کنید:</p>
              <a class='btn btn-outline-light btn-sm' 
                 href='/importFiles/downloadErrorFile?filePath=${encodeURIComponent(result.errorFilePath)}'>
                <i class="fas fa-download me-1"></i>
                دانلود فایل خطاها
              </a>
            </div>
          `;
        }

        errorHtml += `</div>`;
        errorDiv.innerHTML = errorHtml;

        // حذف پیام‌های خطای قبلی
        const existingErrors = document.querySelectorAll('.import-error-message');
        existingErrors.forEach((el) => el.remove());

        // اضافه کردن پیام خطای جدید
        const importContainer = document.querySelector('.import-file-container');
        if (importContainer) {
          console.log('Inserting error message before import container');
          importContainer.insertAdjacentElement('beforebegin', errorDiv);
        } else {
          console.error('Import container not found!');
        }

        // اگر خطای سرور بود، پیام را با toastr نمایش بده
        if (response.status === 500) {
          toastr.error(result.message, 'خطا');
        }
        enableSubmitButton(submitButton);
        return false;
      }

      // در صورت موفقیت
      if (result.success) {
        // شروع پیگیری پیشرفت
        startProgressTracking();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      // پنهان کردن نوار پیشرفت
      if (progressBar) progressBar.style.display = 'none';
      if (progressText) progressText.style.display = 'none';

      // نمایش خطای کلی
      toastr.error('خطا در ارتباط با سرور', 'خطا');
      enableSubmitButton(submitButton);
    }

    return false;
  });
});

// تابع فعال کردن مجدد دکمه submit
function enableSubmitButton(button) {
  if (button) {
    button.disabled = false;
    button.innerHTML = 'تایید';
  }
}
