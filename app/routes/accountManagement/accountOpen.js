const express = require('express');
const accountOpenControllers = require('@controllers/accountManagement/accountOpen');
const router = express.Router();
const accessControlMiddleware = require('@middlewares/accessControlMiddleware');

router.get('/api/getData', [accessControlMiddleware('accountInfo', 'read')], accountOpenControllers.getData);

router.get('/index', [accessControlMiddleware('accountInfo', 'read')], accountOpenControllers.index);
router.get('/create', [accessControlMiddleware('accountInfo', 'create')], accountOpenControllers.create);
// router.post('/store', [accessControlMiddleware('accountInfo', 'create')], accountOpenControllers.store);
// router.get('/edit/:id', [accessControlMiddleware('accountInfo', 'edit')], accountOpenControllers.edit);
// router.post('/update/:id', [accessControlMiddleware('accountInfo', 'edit')], accountOpenControllers.update);
// router.get('/delete/:id', [accessControlMiddleware('accountInfo', 'delete')], accountOpenControllers.delete);

module.exports = router;
