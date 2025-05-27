const express = require('express');
const router = express.Router();
const importFilesController = require('../controllers/importFilesController');
const testController = require('../controllers/importFiles/test');
const { isAuthenticated } = require('../middleware/auth');

// مسیر برای آپلود و پردازش فایل
router.post('/importCodingData', isAuthenticated, importFilesController.importCodingData);

// مسیر برای دریافت وضعیت پیشرفت
router.get('/getImportProgress', isAuthenticated, importFilesController.getImportProgress);

// مسیرهای تست
router.get('/test', isAuthenticated, (req, res) => {
    res.render('importFiles/test');
});

router.post('/test/startProgress', isAuthenticated, testController.startProgress);
router.get('/test/getProgress', isAuthenticated, testController.getProgress);

module.exports = router; 