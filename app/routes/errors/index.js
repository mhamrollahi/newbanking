const errorsController = require('@controllers/errors');
const router = require('express').Router();

router.get('/403', errorsController.error403);
router.get('/404', errorsController.error404);

module.exports =  router