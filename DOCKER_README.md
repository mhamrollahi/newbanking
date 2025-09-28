# Docker Setup for NewBanking Application

این راهنما برای راه‌اندازی پروژه NewBanking با Docker در Ubuntu Linux است.

## پیش‌نیازها

- Docker
- Docker Compose
- Git

## نصب Docker در Ubuntu

```bash
# به‌روزرسانی سیستم
sudo apt update

# نصب Docker
sudo apt install docker.io docker-compose

# اضافه کردن کاربر به گروه docker
sudo usermod -aG docker $USER

# راه‌اندازی مجدد سیستم یا خروج و ورود مجدد
sudo systemctl enable docker
sudo systemctl start docker
```

## راه‌اندازی پروژه

### 1. کلون کردن پروژه
```bash
git clone <repository-url>
cd Newbanking
```

### 2. تنظیم متغیرهای محیطی
```bash
# کپی کردن فایل نمونه
cp env.example .env

# ویرایش فایل .env با مقادیر مناسب
nano .env
```

### 3. ساخت و راه‌اندازی کانتینرها
```bash
# ساخت و راه‌اندازی تمام سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# مشاهده وضعیت کانتینرها
docker-compose ps
```

## دستورات مفید

### مدیریت کانتینرها
```bash
# توقف تمام سرویس‌ها
docker-compose down

# توقف و حذف volume ها
docker-compose down -v

# راه‌اندازی مجدد
docker-compose restart

# مشاهده لاگ‌های یک سرویس خاص
docker-compose logs -f app
docker-compose logs -f mysql
```

### دسترسی به کانتینرها
```bash
# دسترسی به کانتینر اپلیکیشن
docker-compose exec app sh

# دسترسی به MySQL
docker-compose exec mysql mysql -u root -p
```

### مدیریت دیتابیس
```bash
# پشتیبان‌گیری از دیتابیس
docker-compose exec mysql mysqldump -u root -p newbanking > backup.sql

# بازگردانی دیتابیس
docker-compose exec -T mysql mysql -u root -p newbanking < backup.sql
```

## پورت‌ها

- **اپلیکیشن**: http://localhost:3000
- **MySQL**: localhost:3306

## Volume ها

- `mysql_data`: داده‌های MySQL
- `uploads_data`: فایل‌های آپلود شده
- `logs_data`: فایل‌های لاگ

## عیب‌یابی

### مشکلات رایج

1. **خطای اتصال به دیتابیس**:
   ```bash
   # بررسی وضعیت MySQL
   docker-compose logs mysql
   
   # راه‌اندازی مجدد MySQL
   docker-compose restart mysql
   ```

2. **مشکل در ساخت اپلیکیشن**:
   ```bash
   # ساخت مجدد بدون cache
   docker-compose build --no-cache
   ```

3. **مشکل در دسترسی به فایل‌ها**:
   ```bash
   # بررسی مجوزهای فایل‌ها
   ls -la uploads/
   
   # تغییر مجوزها
   chmod -R 755 uploads/
   ```

## تنظیمات امنیتی

1. **تغییر رمزهای عبور پیش‌فرض** در فایل `.env`
2. **استفاده از SSL** در production
3. **محدود کردن دسترسی به پورت‌ها** در firewall

## پشتیبان‌گیری

```bash
# پشتیبان‌گیری کامل
docker-compose exec mysql mysqldump -u root -p newbanking > backup_$(date +%Y%m%d_%H%M%S).sql

# پشتیبان‌گیری از volume ها
docker run --rm -v newbanking_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .
```

## به‌روزرسانی

```bash
# دریافت آخرین تغییرات
git pull

# ساخت مجدد و راه‌اندازی
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
