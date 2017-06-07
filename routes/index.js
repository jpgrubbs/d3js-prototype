var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/loading', function(req,res,next) {
  res.render('loading');
});

module.exports = router;
