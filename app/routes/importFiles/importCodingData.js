const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const importCodingDataControllers = require('@controllers/importFiles/importCodingData');
const testController = require('@controllers/importFiles/test')


router.get('/importCodingData', importCodingDataControllers.importCodingData);
router.post('/importCodingData', upload.single('excelFile'), importCodingDataControllers.importCodingData_Save);
router.get('/downloadErrorFile', importCodingDataControllers.downloadErrorFile);
router.get('/getImportProgress', importCodingDataControllers.getImportProgress);

router.get('/test',(req,res)=>{
  res.render('importFiles/test');
});

router.post('/test/startProgress',  testController.startProgress);
router.get('/test/getProgress',  testController.getProgress);

module.exports = router;
