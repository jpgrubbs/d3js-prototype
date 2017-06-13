var express = require('express');
var router = express.Router();
var statistics_controller = require('../controllers/statisticsController');

/* GET home page. */
router.get('/', statistics_controller.get_statistics);

module.exports = router;
