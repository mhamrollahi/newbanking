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
  progressBarInner.style.backgroundColor = '#0056b3';

  // پاکسازی interval قبلی
  stopProgressTracking();

  // شروع چک کردن پیشرفت
  checkProgress();
  progressInterval = setInterval(checkProgress, 500);
}

function stopProgressTracking() {
  if (progressInterval) {
    console.log('Clearing progress interval');
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

async function checkProgress() {
  if (isImportCompleted) {
    console.log('Import already completed, skipping progress check');
    return;
  }

  try {
    const response = await fetch(`/importFiles/getImportProgress?importId=${currentImportId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log('Progress data:', data);

    const progressBar = document.querySelector('#progress-bar');
    const progressText = document.getElementById('progress-text');

    if (!progressBar || !progressText) return;

    // محاسبه درصد پیشرفت
    const percent = data.percent || 0;

    // به‌روزرسانی نوار پیشرفت
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = `${percent}%`;

    // تنظیم رنگ و متن بر اساس وضعیت
    if (data.status === 'completed' || data.isCompleted) {
      progressBar.style.backgroundColor = '#28a745';
      progressText.textContent = `عملیات با موفقیت انجام شد (${data.current} از ${data.total} رکورد)`;
      progressText.style.color = '#28a745';
      isImportCompleted = true;
      stopProgressTracking();

      // نمایش پیام موفقیت
      toastr.success('عملیات با موفقیت انجام شد', 'موفق');

      // فعال کردن مجدد دکمه submit
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) enableSubmitButton(submitButton);
    } else if (data.status === 'error') {
      progressBar.style.backgroundColor = '#dc3545';
      progressText.textContent = 'خطا در پردازش فایل';
      progressText.style.color = '#dc3545';
      isImportCompleted = true;
      stopProgressTracking();

      // نمایش پیام خطا
      toastr.error('خطا در پردازش فایل', 'خطا');

      // فعال کردن مجدد دکمه submit
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) enableSubmitButton(submitButton);
    } else {
      progressBar.style.backgroundColor = data.phase === 'validating' ? '#17a2b8' : '#0056b3';
      progressText.textContent = data.phase === 'validating' ? `در حال اعتبارسنجی داده‌ها... (${data.current} از ${data.total} رکورد)` : `در حال ذخیره‌سازی... (${data.current} از ${data.total} رکورد)`;
      progressText.style.color = '#0056b3';
    }
  } catch (error) {
    console.error('Error checking progress:', error);
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
