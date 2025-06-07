/* global toastr */
let progressInterval = null;
let currentImportId = null;
// این فایل برای مدیریت پیشرفت بارگذاری داده‌ها در فرم importCodingData استفاده می‌شود
// این فایل باید در صفحه importCodingData.html لود شود

// تست لود شدن فایل
console.log('importData_Progressbar.js loaded');

function startProgressTracking(importId) {
  currentImportId = importId || null; // اگر importId داده شده باشد، آن را ذخیره می‌کند

  console.log('Starting progress tracking');
  const progressText = document.getElementById('progress-text');
  if (!progressText) {
    console.error('Progress text element not found!');
    return;
  }

  progressText.style.display = 'block';
  progressText.textContent = 'در حال شروع پردازش...';

  if (progressInterval) {
    clearInterval(progressInterval);
  }

  // شروع چک کردن وضعیت پیشرفت
  checkProgress(progressText);

  progressInterval = setInterval(() => {
    checkProgress(progressText);
  }, 500);
}

async function checkProgress(progressText) {
  try {
    const response = await fetch(`/importFiles/getImportProgress?importId=${currentImportId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Progress data received:', data);

    if (data.status === 'completed') {
      console.log('Import completed');
      clearInterval(progressInterval);
      const percent = Math.round((data.current / data.total) * 100);
      progressText.textContent = `پردازش با موفقیت انجام شد (${percent}% - ${data.current} از ${data.total} رکورد)`;

      // به جای ریفرش کردن صفحه، فقط نوار پیشرفت رو مخفی می‌کنیم
      setTimeout(() => {
        const progressBar = document.querySelector('.progress');
        if (progressBar) progressBar.style.display = 'none';
        progressText.style.display = 'none';
      }, 3000);
    } else if (data.status === 'error') {
      console.log('Import error');
      clearInterval(progressInterval);
      progressText.textContent = 'خطا در پردازش فایل';

      // نمایش پیام خطا اگر وجود داشته باشد
      if (data.errorMessage) {
        const existingError = document.querySelector('.import-error-message');
        if (existingError) {
          existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'col-12 w-100 d-flex justify-content-center mt-1 mb-1 flex-column import-error-message';
        errorDiv.innerHTML = `
          <p class='alert alert-danger w-50 text-center align-self-center'>
            ${data.errorMessage}
            ${
              data.errorFilePath
                ? `
              <br/>
              <a style='font-size: 17px;font-style: italic;color:#01019e' 
                 href='/importFiles/downloadErrorFile?filePath=${data.errorFilePath}'>
                دانلود فایل خطاها
              </a>
            `
                : ''
            }
          </p>
        `;

        const importContainer = document.querySelector('.import-file-container');
        importContainer.insertAdjacentElement('beforebegin', errorDiv);
      }
    } else if (data.total > 0) {
      const percent = Math.round((data.current / data.total) * 100);
      progressText.textContent = `در حال پردازش... ${percent}% (${data.current} از ${data.total} رکورد)`;
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

    const formData = new FormData(this);
    const tableName = formData.get('tableName');
    const excelFile = formData.get('excelFile');

    if (!tableName) {
      alert('لطفا جدول را انتخاب کنید');
      return false;
    }

    if (!excelFile || excelFile.size === 0) {
      alert('لطفا فایل اکسل را انتخاب کنید');
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
        return false;
      }

      // در صورت موفقیت
      if (result.success) {
        // شروع پیگیری پیشرفت
        startProgressTracking();

        // نمایش پیام موفقیت
        toastr.success(result.message, 'موفق');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      // پنهان کردن نوار پیشرفت
      if (progressBar) progressBar.style.display = 'none';
      if (progressText) progressText.style.display = 'none';

      // نمایش خطای کلی
      toastr.error('خطا در ارتباط با سرور', 'خطا');
    }

    // جلوگیری از submit شدن فرم
    return false;
  });
});
