// استفاده از الگوی Singleton برای اطمینان از حفظ وضعیت
class ProgressTracker {
    constructor() {
        if (ProgressTracker.instance) {
            console.log('Using existing ProgressTracker instance');
            return ProgressTracker.instance;
        }
        console.log('Creating new ProgressTracker instance');
        ProgressTracker.instance = this;
        
        this.current = 0;
        this.total = 1000;
        this.status = 'idle';
        this.interval = null;
    }

    startProgress() {
        console.log('=== startProgress called ===');
        console.log('Current state before reset:', this.getProgress());
        
        // اگر قبلاً پردازشی در حال انجام است، آن را متوقف کن
        if (this.interval) {
            console.log('Clearing existing interval');
            clearInterval(this.interval);
        }

        // ریست کردن وضعیت پیشرفت
        this.current = 0;
        this.total = 1000;
        this.status = 'processing';
        console.log('Progress reset to:', this.getProgress());

        // شروع پردازش با setInterval
        console.log('Starting new interval');
        this.interval = setInterval(() => {
            this.current += 1;
            console.log('Interval tick - Progress:', this.getProgress());

            if (this.current >= this.total) {
                console.log('Reached total, clearing interval');
                clearInterval(this.interval);
                this.status = 'completed';
                console.log('Final progress state:', this.getProgress());
            }
        }, 100);
        
        console.log('Interval started with ID:', this.interval);
    }

    getProgress() {
        const progress = {
            current: this.current,
            total: this.total,
            status: this.status
        };
        console.log('getProgress called, returning:', progress);
        return progress;
    }
}

// ایجاد یک نمونه از ProgressTracker
const progressTracker = new ProgressTracker();

module.exports = {
    startProgress: () => progressTracker.startProgress(),
    getProgress: () => progressTracker.getProgress()
}; 