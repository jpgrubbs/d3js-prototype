var express = require('express');
var router = express.Router();
var statistics_controller = require('../controllers/statisticsController');

/* GET home page. */
router.get('/', statistics_controller.get_statistics);

router.get('/songs', statistics_controller.get_songs);

module.exports = router;
