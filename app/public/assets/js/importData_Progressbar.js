let progressInterval = null;

// تست لود شدن فایل
console.log('importData_Progressbar.js loaded - Test mishavd ...');

function startProgressTracking(importId) {
  console.log('Starting progress tracking for importId:', importId);
  const progressText = document.getElementById('progress-text');
  if (!progressText) {
    console.error('Progress text element not found!');
    return;
  }

  progressText.style.display = 'block';
  progressText.textContent = 'در حال شروع پردازش...';
  console.log('Progress text element updated');

  if (progressInterval) {
    clearInterval(progressInterval);
  }

  progressInterval = setInterval(async () => {
    try {
      console.log('Checking progress for importId:', importId);
      const response = await fetch(`/importFiles/getImportProgress?importId=${importId}`);
      
      console.log('Fetch response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('after fetch .....  Checking progress for importId:', importId);

      const data = await response.json();
      console.log('Progress data received:', data);

      if (data.status === 'completed') {
        console.log('Import completed');
        clearInterval(progressInterval);
        const percent = Math.round((data.current / data.total) * 100);
        progressText.textContent = `پردازش با موفقیت انجام شد (${percent}% - ${data.current} از ${data.total} رکورد)`;
        toastr.success('اطلاعات با موفقیت در سامانه ذخیره شد.', 'توجه');
        setTimeout(() => {
          progressText.style.display = 'none';
          window.location.reload();
        }, 3000);
      } else if (data.status === 'error') {
        console.log('Import error:', data.message);
        clearInterval(progressInterval);
        progressText.textContent = `خطا: ${data.message}`;
        toastr.error(data.message, 'خطا');
      } else if (data.total > 0) {
        const percent = Math.round((data.current / data.total) * 100);
        progressText.textContent = `در حال پردازش... ${percent}% (${data.current} از ${data.total} رکورد)`;
        console.log('Progress updated:', percent + '%');
      }
    } catch (error) {
      console.error('Error checking progress:', error);
      toastr.error('خطا در بررسی وضعیت پیشرفت', 'خطا');
    }
  }, 1000);
}

// اضافه کردن event listener به فرم
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('frmImportCodingData');
  if (!form) {
    console.error('Form not found!');
    return;
  }

  console.log('Form found, adding submit listener');
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(this);
    const tableName = formData.get('tableName');
    const excelFile = formData.get('excelFile');
    console.log('Submitting form with:', { tableName, excelFile });

    try {
      const response = await fetch('/importFiles/importCodingData', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      if (result.success) {
        console.log('Starting progress tracking with importId:', result.importId);
        startProgressTracking(result.importId);
      } else {
        console.error('Server returned error:', result.message);
        toastr.error(result.message, 'خطا');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toastr.error('خطا در ارسال فرم', 'خطا');
    }
  });
});
