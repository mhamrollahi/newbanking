const express = require('express');
const accountOpenControllers = require('@controllers/accountManagement/accountOpen');
const router = express.Router();
const accessControlMiddleware = require('@middlewares/accessControlMiddleware');

router.get('/api/getData', [accessControlMiddleware('accountInfos', 'read')], accountOpenControllers.getData);

router.get('/index', [accessControlMiddleware('accountInfos', 'read')], accountOpenControllers.index);
router.get('/create', [accessControlMiddleware('accountInfos', 'create')], accountOpenControllers.create);
router.post('/store', [accessControlMiddleware('accountInfos', 'create')], accountOpenControllers.store);
// router.get('/edit/:id', [accessControlMiddleware('accountInfos', 'edit')], accountOpenControllers.edit);
// router.post('/update/:id', [accessControlMiddleware('accountInfos', 'edit')], accountOpenControllers.update);
// router.get('/delete/:id', [accessControlMiddleware('accountInfos ', 'delete')], accountOpenControllers.delete);

router.get('/api/getNextAvailableAccountNumber/:bankId/:onlineCode', accountOpenControllers.getNextAvailableAccountNumber);

module.exports = router;
