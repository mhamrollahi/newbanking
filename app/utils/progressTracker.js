// استفاده از الگوی Singleton برای اطمینان از حفظ وضعیت
class ProgressTracker {
    constructor() {
        if (ProgressTracker.instance) {
            // console.log('Using existing ProgressTracker instance');
            return ProgressTracker.instance;
        }
        // console.log('Creating new ProgressTracker instance');
        ProgressTracker.instance = this;
        
        this.current = 0;
        this.total = 0;  // مقدار اولیه صفر، در زمان شروع پردازش با تعداد رکوردهای اکسل به‌روز می‌شود
        this.status = 'idle';
        this.interval = null;
        this.lastUpdateTime = Date.now();
    }

    startProgress() {
        // console.log('=== startProgress called ===');
        // console.log('Current state before reset:', this.getProgress());
        
        // اگر قبلاً پردازشی در حال انجام است، آن را متوقف کن
        if (this.interval) {
            // console.log('Clearing existing interval');
            clearInterval(this.interval);
        }
        
        // ریست کردن وضعیت پیشرفت
        this.current = 0;
        this.status = 'processing';
        this.lastUpdateTime = Date.now();
        // console.log('Progress reset to:', this.getProgress());
    }

    updateProgress(current, total) {
        // اطمینان از اینکه پیشرفت به صورت نرم افزایش می‌یابد
        const now = Date.now();
        const timeDiff = now - this.lastUpdateTime;
        
        // اگر زمان بین به‌روزرسانی‌ها خیلی کم است، پیشرفت را نرم‌تر افزایش می‌دهیم
        if (timeDiff < 100) {
            const smoothProgress = Math.min(current, this.current + 1);
            this.current = smoothProgress;
        } else {
            this.current = current;
        }
        
        this.total = total;
        this.status = 'processing';
        this.lastUpdateTime = now;
        // console.log('Progress updated:', this.getProgress());
    }

    completeProgress() {
        this.status = 'completed';
        this.current = this.total; // اطمینان از اینکه در 100% تمام می‌شود
        // console.log('Progress completed:', this.getProgress());
    }

    setError() {
        this.status = 'error';
        // console.log('Progress error:', this.getProgress());
    }

    getProgress() {
        const progress = {
            current: this.current,
            total: this.total,
            status: this.status
        };
        // console.log('getProgress called, returning:', progress);
        return progress;
    }
}

// ایجاد یک نمونه از ProgressTracker
const progressTracker = new ProgressTracker();

module.exports = {
    startProgress: () => progressTracker.startProgress(),
    getProgress: () => progressTracker.getProgress(),
    updateProgress: (current, total) => progressTracker.updateProgress(current, total),
    completeProgress: () => progressTracker.completeProgress(),
    setError: () => progressTracker.setError()
}; 