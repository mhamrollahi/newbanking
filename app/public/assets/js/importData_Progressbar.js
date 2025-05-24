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
  console.log('DOM Content Loaded - Checking form...');
  const form = document.getElementById('frmImportCodingData');
  if (!form) {
    console.error('Form not found! Make sure the form has id="frmImportCodingData"');
    return;
  }

  console.log('Form found:', form);
  console.log('Form elements:', {
    tableName: form.querySelector('[name="tableName"]'),
    excelFile: form.querySelector('[name="excelFile"]')
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Form submitted - Starting validation...');

    const formData = new FormData(this);
    const tableName = formData.get('tableName');
    const excelFile = formData.get('excelFile');

    if (!tableName) {
      console.error('Table name is required!');
      toastr.error('لطفا جدول را انتخاب کنید', 'خطا');
      return;
    }

    if (!excelFile || excelFile.size === 0) {
      console.error('Excel file is required!');
      toastr.error('لطفا فایل اکسل را انتخاب کنید', 'خطا');
      return;
    }

    console.log('Form validation passed:', { tableName, excelFile });

    try {
      console.log('Starting form submission...');
      const response = await fetch('/importFiles/importCodingData', {
        method: 'POST',
        body: formData
      });

      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read the response as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse the JSON response
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Server response parsed:', result);
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error('Invalid JSON response from server');
      }

      if (result.success) {
        console.log('Server returned success, importId:', result.importId);
        startProgressTracking(result.importId);
      } else {
        console.log('Server returned error:', result);
        toastr.error(result.message, 'خطا');
        if (result.errorFilePath) {
          console.log('Error file path found:', result.errorFilePath);
          const downloadLink = document.createElement('a');
          downloadLink.href = `/importFiles/downloadErrorFile?filePath=${result.errorFilePath}`;
          downloadLink.textContent = 'دانلود فایل خطاها';
          downloadLink.className = 'btn btn-warning mt-2';
          document.getElementById('progress-text').appendChild(downloadLink);
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toastr.error('خطا در ارسال فرم', 'خطا');
    }
  });
});
