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
            setTimeout(() => {
                progressText.style.display = 'none';
                window.location.reload();
            }, 3000);
        } else if (data.status === 'error') {
            console.log('Import error');
            clearInterval(progressInterval);
            progressText.textContent = 'خطا در پردازش فایل';
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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Form submitted');

        const formData = new FormData(this);
        const tableName = formData.get('tableName');
        const excelFile = formData.get('excelFile');

        if (!tableName) {
            alert('لطفا جدول را انتخاب کنید');
            return;
        }

        if (!excelFile || excelFile.size === 0) {
            alert('لطفا فایل اکسل را انتخاب کنید');
            return;
        }

        // نمایش اولیه پیشرفت
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');

        if (progressText) {
            progressText.style.display = 'block';
            progressBar.style.display = 'block';
            progressText.textContent = 'در حال شروع پردازش...';
        }

        try {
            const response = await fetch('/importFiles/importCodingData', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success && !result.importId) {
                throw new Error(result.message);
            }
            // فقط اگر importId دریافت شد، نوار پیشرفت را شروع کن
            console.log('in browser - Import ID:', result.importId);

            if (result.importId) {
                startProgressTracking(result.importId);
            } else {
                if (progressText) {
                    progressText.textContent = 'خطا در شروع عملیات import';
                }
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            alert('خطا در ارسال فرم');
            if (progressText) {
                progressText.textContent = 'خطا در ارسال فرم';
            }
        }
    });
});