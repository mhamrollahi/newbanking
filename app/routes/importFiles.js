const express = require('express');
const router = express.Router();
const importFilesController = require('../controllers/importFilesController');
const { isAuthenticated } = require('../middleware/auth');

// مسیر برای آپلود و پردازش فایل
router.post('/importCodingData', isAuthenticated, importFilesController.importCodingData);

// مسیر برای دریافت وضعیت پیشرفت
router.get('/getImportProgress', isAuthenticated, importFilesController.getImportProgress);

module.exports = router; 