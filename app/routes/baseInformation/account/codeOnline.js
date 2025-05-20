const express = require('express');
const codeOnlineControllers = require('@controllers/baseInformation/account/codeOnline');
const router = express.Router();
const accessControlMiddleware = require('@middlewares/accessControlMiddleware');

router.get('/api/getData', [accessControlMiddleware('codeonlines', 'read')], codeOnlineControllers.getData);
router.get('/api/getOnlineCodeByOrganizationId/:organizationId', [accessControlMiddleware('codeonlines', 'read')], codeOnlineControllers.getOnlineCodeByOrganizationId);

router.get('/index', [accessControlMiddleware('codeonlines', 'read')], codeOnlineControllers.index);
router.get('/create', [accessControlMiddleware('codeonlines', 'create')], codeOnlineControllers.create);
router.post('/store', [accessControlMiddleware('codeonlines', 'create')], codeOnlineControllers.store);
router.get('/edit/:id', [accessControlMiddleware('codeonlines', 'edit')], codeOnlineControllers.edit);
router.post('/update/:id', [accessControlMiddleware('codeonlines', 'edit')], codeOnlineControllers.update);
router.get('/delete/:id', [accessControlMiddleware('codeonlines', 'delete')], codeOnlineControllers.delete);

module.exports = router;
