const request = require('superagent');
var apiString = "http://localhost:3000/rest";
if(process.env.NODE_ENV === 'production'){
  apiString = "http://avett-statistics.herokuapp.com/rest";
}

var amphitheatre, theatre, fest, arena, occurrences, numAmphitheatre, numTheatre, numFest, numArena;
amphitheatre = theatre = fest = arena = occurrences = numAmphitheatre = numTheatre = numFest = numArena = 0;


exports.get_statistics = function(req,res){
  request.get(`${apiString}/artist`).query({id: "0a176d0a-ef46-4e7f-b018-9f4d65614668"}).end(
    function(err,result){
      var songName = req.query.song;
      var setlists = result.body.setlists;
      for(var i in setlists){
        var venue = setlists[i].venue;
        var venueName = venue['@name'];
        addVenueTally(venueName);
        var sets = setlists[i].sets.set;
        if(!sets){continue;}
        if(sets.constructor === Array){
          for(var j in sets){
            var songs = sets[j].song;
            if(songs.constructor === Array){
              for(var k in songs){
                var song = songs[k];
                var name = song['@name'];
                if(name.toLowerCase() === songName.toLowerCase()){
                  addSongTally(venueName);
                  occurrences++;
                }
              }
            } else {
              var name = song['@name'];
              if(name.toLowerCase() === songName.toLowerCase()){
                addSongTally(venueName);
                occurrences++;
              }
            }
          }
        } else {
          var songs = sets.song;
          if(songs.constructor === Array){
            for(var k in songs){
              var song = songs[k];
              var name = song['@name'];
              if(name.toLowerCase() === songName.toLowerCase()){
                addSongTally(venueName);
                occurrences++;
              }
            }
          } else {
            var name = song['@name'];
            if(name.toLowerCase() === songName.toLowerCase()){
              addSongTally(venueName);
              occurrences++;
            }
          }
        }
      }
      console.log(occurrences);
      res.send({amphitheatre:amphitheatre/numAmphitheatre, theatre:theatre/numTheatre, arena:arena/numArena, fest:fest/numFest,
                numAmp:amphitheatre, numTheatre:theatre, numArena:arena, numFest:fest});
    });

    addSongTally = function(venue){
      venue = venue.toLowerCase();
      if(venue.includes("fest")||venue.includes("festival")){
        fest++;
      }
      else if(venue.includes("arena")||venue.includes("coliseum")||venue.includes("civic center")){
        arena++;
      }
      else if(venue.includes(" theatre")||venue.includes(" theater")||venue.includes("hall")){
        theatre++;
      }
      else if(venue.includes("amphitheatre")||venue.includes("amphitheater")||venue.includes("park")||venue.includes("pavilion")){
        amphitheatre++;
      }
    }

    addVenueTally = function(venue){
      venue = venue.toLowerCase();
      if(venue.includes("fest")||venue.includes("festival")){
        numFest++;
      }
      else if(venue.includes("arena")||venue.includes("coliseum")||venue.includes("civic center")){
        numArena++;
      }
      else if(venue.includes(" theatre")||venue.includes(" theater")||venue.includes("hall")){
        numTheatre++;
      }
      else if(venue.includes("amphitheatre")||venue.includes("amphitheater")||venue.includes("park")||venue.includes("pavilion")){
        numAmphitheatre++;
      }
    }

};
