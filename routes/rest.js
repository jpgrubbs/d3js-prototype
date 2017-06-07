var express = require('express');
var router = express.Router();

var setlists_controller = require('../controllers/setlistsController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/artist', setlists_controller.get_artist_setlists_cache, setlists_controller.get_artist_setlists
);

module.exports = router;
