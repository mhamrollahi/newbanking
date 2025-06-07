// استفاده از الگوی Singleton برای اطمینان از حفظ وضعیت
class ProgressTracker {
  constructor() {
    if (ProgressTracker.instance) {
      // console.log('Using existing ProgressTracker instance');
      return ProgressTracker.instance;
    }
    // console.log('Creating new ProgressTracker instance');
    ProgressTracker.instance = this;
    this.reset();
  }

  reset() {
    this.current = 0;
    this.total = 0;
    this.status = 'idle';
    this.phase = 'idle';
    this.lastUpdateTime = Date.now();
    this.smoothProgress = 0;
    this.isCompleted = false;
  }

  startProgress(phase = 'importing') {
    // console.log('=== startProgress called ===');
    // console.log('Current state before reset:', this.getProgress());

    this.reset();
    this.status = 'processing';
    this.phase = phase;
    this.lastUpdateTime = Date.now();
    // console.log('Progress started:', this.getProgress());
  }

  updateProgress(current, total) {
    if (this.isCompleted) return; // اگر عملیات تمام شده، دیگر آپدیت نکن

    this.current = Math.min(current, total);
    this.total = total;
    this.status = 'processing';
    this.lastUpdateTime = Date.now();

    // اطمینان از اینکه پیشرفت به صورت نرم افزایش می‌یابد
    const now = Date.now();
    const timeDiff = now - this.lastUpdateTime;

    // محاسبه پیشرفت نرم
    if (timeDiff < 100) {
      // افزایش تدریجی پیشرفت
      this.smoothProgress = Math.min(current, this.smoothProgress + Math.max(1, Math.floor((current - this.smoothProgress) * 0.1)));
      this.current = this.smoothProgress;
    } else {
      // به‌روزرسانی مستقیم در صورت تأخیر زیاد
      this.smoothProgress = current;
    }

    // اگر مقدار total تغییر کرده، آن را به‌روز کن
    if (this.total !== total) {
      this.total = total;
    }

    this.status = current >= total ? 'completed' : 'processing';
    this.lastUpdateTime = now;
    // console.log('Progress updated:', this.getProgress());
  }

  completeProgress() {
    this.current = this.total;
    this.status = 'completed';
    this.isCompleted = true;
    this.smoothProgress = this.total;
    // console.log('Progress completed:', this.getProgress());
  }

  setError() {
    this.status = 'error';
    this.isCompleted = true;
    // console.log('Progress error:', this.getProgress());
  }

  getProgress() {
    return {
      current: this.current,
      total: this.total,
      status: this.status,
      phase: this.phase,
      isCompleted: this.isCompleted
    };
  }
}

// ایجاد یک نمونه از ProgressTracker
const progressTracker = new ProgressTracker();

module.exports = {
  startProgress: (phase) => progressTracker.startProgress(phase),
  getProgress: () => progressTracker.getProgress(),
  updateProgress: (current, total) => progressTracker.updateProgress(current, total),
  completeProgress: () => progressTracker.completeProgress(),
  setError: () => progressTracker.setError()
};
