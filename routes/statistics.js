var express = require('express');
var router = express.Router();
var statistics_controller = require('../controllers/statisticsController');

/* GET home page. */
router.get('/', statistics_controller.get_statistics);

router.get('/view',function(req,res){
  res.render('stats',{song: req.query.song.replace(/([A-Z])/g, ' $1').trim()});
})

module.exports = router;
