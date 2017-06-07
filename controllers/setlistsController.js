const request = require('superagent');
const async = require('async');
const redis = require('redis');
var REDIS_LOC = process.env.REDIS_PORT;
if(process.env.NODE_ENV === 'production'){
  REDIS_LOC = process.env.REDIS_URL
}
const client = redis.createClient(REDIS_LOC);

exports.get_artist_setlists_cache = function(req,res,next){
  var artistId = req.query.id;
  client.get(artistId, function(err,data){
    if(err) throw err;

    if(data != null) {
      console.log(JSON.parse(data));
      res.send(JSON.parse(data));
    } else{
      next();
    }
  });
}

exports.get_artist_setlists = function(req,res,next){
  var artistId = req.query.id;
  var i = 1;
  var numSetlists;
  var setlists = {"setlists":[]};
  async.doWhilst( function(cb){
    request.get(`http://api.setlist.fm/rest/0.1/artist/${artistId}/setlists.json`)
    .query({p: i})
    .end(function(err, response) {
      if(err){
        console.log(err);
        cb(err);
      }
      var setlistArray = response.body.setlists.setlist;
      for(var j =0; j < setlistArray.length; j++){
        setlists["setlists"].push(setlistArray[j]);
      }
      console.log("recieved page " + i);
      i++;
      numSetlists = response.body.setlists['@total'];
      cb();
    });
  }, function(){
    if(i <= numSetlists/20+1){
      return true;
    }
    return false;
  }, function(err){
    if(err){console.log(err);}
    //console.log(JSON.stringify(setlists));
    client.set(artistId, JSON.stringify(setlists,undefined,2));
    res.send(setlists)});

}
