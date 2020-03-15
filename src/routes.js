const express = require('express');
const MobileService = require('./MobileService');
const EtlService = require('./EtlService');
const router = express.Router();

router.get('/mobile/:page', MobileService.getJSON);
router.get('/etl', EtlService.getJSON);

module.exports = router;