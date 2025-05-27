const progressTracker = require('../../utils/progressTracker');

// تابع برای شروع پردازش
exports.startProgress = async (req, res) => {
    console.log('=== Controller: startProgress called ===');
    try {
        // شروع پردازش
        console.log('Calling progressTracker.startProgress()');
        progressTracker.startProgress();
        console.log('progressTracker.startProgress() completed');

        return res.json({
            success: true,
            message: 'پردازش شروع شد'
        });
    } catch (error) {
        console.error('Error in startProgress:', error);
        return res.status(500).json({
            success: false,
            message: 'خطا در شروع پردازش'
        });
    }
};

// تابع برای دریافت وضعیت پیشرفت
exports.getProgress = async (req, res) => {
    console.log('=== Controller: getProgress called ===');
    try {
        const progress = progressTracker.getProgress();
        console.log('Current progress from tracker:', progress);
        
        return res.json({
            success: true,
            current: progress.current,
            total: progress.total,
            status: progress.status
        });
    } catch (error) {
        console.error('Error in getProgress:', error);
        return res.status(500).json({
            success: false,
            message: 'خطا در دریافت وضعیت پیشرفت'
        });
    }
}; 