const express = require('express')
const router = express.Router()
const multer = require('multer')


const upload = multer({dest:'uploads/'})

const importCodingDataControllers = require('@controllers/importFiles/importCodingData')

router.get('/importCodingData',importCodingDataControllers.importCodingData)
router.post('/importCodingData',upload.single('excelFile'),importCodingDataControllers.importCodingData_Save)
router.get('/downloadErrorFile',importCodingDataControllers.downloadErrorFile)


module.exports = router