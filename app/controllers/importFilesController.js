const xlsx = require('xlsx');
const fs = require('fs').promises;
const db = require('../config/database');

// متغیر سراسری برای ذخیره وضعیت پیشرفت
let importProgress = {
    current: 0,
    total: 0,
    status: 'idle'
};

// تابع برای ذخیره رکورد در دیتابیس
async function processAndSaveRecord(record, tableName) {
    try {
        // تبدیل کلیدهای رکورد به ستون‌های جدول
        const columns = Object.keys(record).join(', ');
        const values = Object.values(record);
        const placeholders = values.map(() => '?').join(', ');

        // ساخت کوئری insert
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        
        // اجرای کوئری
        await db.query(query, values);
    } catch (error) {
        console.error('Error saving record:', error);
        throw error;
    }
}

// تابع برای شروع فرآیند import
exports.initImport = async (req, res) => {
    try {
        const { tableName, fileName } = req.body;

        if (!tableName || !fileName) {
            return res.status(400).json({
                success: false,
                message: 'نام جدول و نام فایل الزامی است'
            });
        }

        // ایجاد یک شناسه یکتا برای این عملیات import
        const importId = uuidv4();

        // ذخیره اطلاعات اولیه در دیتابیس
        const query = `
            INSERT INTO import_progress 
            (import_id, table_name, file_name, status, current_count, total_count, start_time) 
            VALUES (?, ?, ?, 'initialized', 0, 0, NOW())
        `;

        await db.query(query, [importId, tableName, fileName]);

        return res.json({
            success: true,
            importId: importId,
            message: 'عملیات import با موفقیت شروع شد'
        });

    } catch (error) {
        console.error('Error in initImport:', error);
        return res.status(500).json({
            success: false,
            message: 'خطا در شروع عملیات import'
        });
    }
};

// تابع برای دریافت وضعیت پیشرفت
exports.getImportProgress = async (req, res) => {
    try {
        return res.json({
            success: true,
            current: importProgress.current,
            total: importProgress.total,
            status: importProgress.status
        });
    } catch (error) {
        console.error('Error in getImportProgress:', error);
        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت وضعیت پیشرفت'
        });
    }
};

// تابع برای آپدیت وضعیت پیشرفت
exports.updateImportProgress = async (importId, current, total, status, errorMessage = null) => {
    try {
        const query = `
            UPDATE import_progress 
            SET current_count = ?, 
                total_count = ?, 
                status = ?,
                error_message = ?,
                update_time = NOW()
            WHERE import_id = ?
        `;

        await db.query(query, [current, total, status, errorMessage, importId]);
    } catch (error) {
        console.error('Error updating import progress:', error);
    }
};

exports.importCodingData = async (req, res) => {
    try {
        const { tableName } = req.body;
        const excelFile = req.file;

        if (!tableName || !excelFile) {
            return res.status(400).json({
                success: false,
                message: 'نام جدول و فایل اکسل الزامی است'
            });
        }

        // ریست کردن وضعیت پیشرفت
        importProgress = {
            current: 0,
            total: 0,
            status: 'processing'
        };

        // خواندن فایل اکسل
        const workbook = await xlsx.readFile(excelFile.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // تنظیم تعداد کل رکوردها
        importProgress.total = data.length;

        // پردازش و ذخیره داده‌ها
        for (let i = 0; i < data.length; i++) {
            try {
                // پردازش و ذخیره هر رکورد
                await processAndSaveRecord(data[i], tableName);

                // آپدیت پیشرفت
                importProgress.current = i + 1;
            } catch (error) {
                console.error('Error processing record:', error);
            }
        }

        // حذف فایل موقت
        await fs.unlink(excelFile.path);

        // اتمام پردازش
        importProgress.status = 'completed';

        return res.json({
            success: true,
            message: 'عملیات import با موفقیت انجام شد'
        });

    } catch (error) {
        console.error('Error in importCodingData:', error);
        importProgress.status = 'error';
        return res.status(500).json({
            success: false,
            message: 'خطا در پردازش فایل'
        });
    }
}; 