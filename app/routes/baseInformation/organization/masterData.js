const express = require('express');
const organizationMasterDataControllers = require('@controllers/baseInformation/organization/masterData');
const router = express.Router();
const accessControlMiddleware = require('@middlewares/accessControlMiddleware');

router.get('/api/getData', [accessControlMiddleware('organizationmasterdata', 'read')], organizationMasterDataControllers.getData);
router.get('/test',  organizationMasterDataControllers.getData);

router.get('/index', [accessControlMiddleware('organizationmasterdata', 'read')], organizationMasterDataControllers.index);
router.get('/create', [accessControlMiddleware('organizationmasterdata', 'create')], organizationMasterDataControllers.create);
router.post('/store', [accessControlMiddleware('organizationmasterdata', 'create')], organizationMasterDataControllers.store);
router.get('/edit/:id', [accessControlMiddleware('organizationmasterdata', 'edit')], organizationMasterDataControllers.edit);
router.post('/update/:id', [accessControlMiddleware('organizationmasterdata', 'edit')], organizationMasterDataControllers.update);
router.get('/delete/:id', [accessControlMiddleware('organizationmasterdata', 'delete')], organizationMasterDataControllers.delete);

module.exports = router;
