const request = require('superagent');
var apiString = "http://localhost:3000/rest";
if(process.env.NODE_ENV === 'production'){
  apiString = "http://avett-statistics.herokuapp.com/rest";
}

var totAmphitheatre, totTheatre, totFestival, totArena, occurrences, numAmphitheatre, numTheatre, numFestival, numArena;

exports.get_songs = function(req,res){
  var allSongs = [];
  request.get(`${apiString}/artist`).query({id: "0a176d0a-ef46-4e7f-b018-9f4d65614668"}).end(
    function(err,result){
      var setlists = result.body.setlists;
      for(var i in setlists){
        var sets = setlists[i].sets.set;
        if(!sets){continue;}
        if(sets.constructor === Array){
          for(var j in sets){
            var songs = sets[j].song;
            if(songs.constructor === Array){
              for(var k in songs){
                var song = songs[k];
                var name = song['@name'];
                if(!allSongs.includes(name)){allSongs.push(name);}
              }
            } else {
              var name = songs['@name'];
              if(!allSongs.includes(name)){allSongs.push(name);}
            }
          }
        } else {
          var songs = sets.song;
          if(songs.constructor === Array){
            for(var k in songs){
              var song = songs[k];
              var name = song['@name'];
              if(!allSongs.includes(name)){allSongs.push(name);}
            }
          } else {
            var name = songs['@name'];
            if(!allSongs.includes(name)){allSongs.push(name);}
          }
        }
      }
      res.send(allSongs.sort());
    });
}

exports.get_statistics = function(req,res){
  totAmphitheatre = totTheatre = totFestival = totArena = occurrences = numAmphitheatre = numTheatre = numFestival = numArena = 0;
  request.get(`${apiString}/artist`).query({id: "0a176d0a-ef46-4e7f-b018-9f4d65614668"}).end(
    function(err,result){
      var songName = req.query.song;
      var fromYear = req.query.fromYear;
      var setlists = result.body.setlists;
      var monthData = {};
      for(var i in setlists){
        var date = setlists[i]['@eventDate'];
        var dateParts = date.split("-");
        var year = dateParts[2];
        var monthYear = dateParts[1]+"-"+dateParts[2];
        if(parseInt(year,10)<parseInt(fromYear,10)) break;
        var venue = setlists[i].venue;
        var venueName = venue['@name'];
        if(!monthData[monthYear]){
          monthData[monthYear] = 0;
        }
        addVenueTally(venueName,year);
        var sets = setlists[i].sets.set;
        if(!sets){continue;}
        if(sets.constructor === Array){
          for(var j in sets){
            var songs = sets[j].song;
            if(venueName.toLowerCase().includes("traverse")){
            }
            if(songs.constructor === Array){
              for(var k in songs){
                var song = songs[k];
                var name = song['@name'];
                if(name.toLowerCase() === songName.toLowerCase()){
                  monthData[monthYear]++;
                  addSongTally(venueName,year);
                  occurrences++;
                }
              }
            } else {
              var name = songs['@name'];
              if(name.toLowerCase() === songName.toLowerCase()){
                monthData[monthYear]++;
                addSongTally(venueName,year);
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
                monthData[monthYear]++;
                addSongTally(venueName,year);
                occurrences++;
              }
            }
          } else {
            var name = songs['@name'];
            if(name.toLowerCase() === songName.toLowerCase()){
              monthData[monthYear]++;
              addSongTally(venueName,year);
              occurrences++;
            }
          }
        }
      }
      var monthDataArray = arrayifyMonthData(monthData);
      var returnObject = {
        song: songName,
        venueData: [
        {
          venue: "amphitheatre",
          percentage: (numAmphitheatre/totAmphitheatre)*100
        },
        {
          venue: "theatre",
          percentage: (numTheatre/totTheatre)*100
        },
        {
          venue: "arena",
          percentage: (numArena/totArena)*100
        },
        {
          venue: "festival",
          percentage: (numFestival/totFestival)*100
        }],
        monthData:monthDataArray
      };

      res.send(returnObject);
      console.log(totTheatre);
      console.log(numTheatre);
                //numAmp:numAmphitheatre, numTheatre:numAheatre, numArena:numArena, numFest:numFest});
    });

    addVenueTally = function(venue, year){
      venue = venue.toLowerCase();
      if(venue.includes("fest")||venue.includes("festival")||venue.includes(year)){
        totFestival++;
      }
      else if(venue.includes("arena")||venue.includes("coliseum")||venue.includes("civic center")||venue.includes("bowl")){
        totArena++;
      }
      else if(venue.includes(" theatre")||venue.includes(" theater")||venue.includes("hall")){
        totTheatre++;
      }
      else if(venue.includes("amphitheatre")||venue.includes("amphitheater")||venue.includes("park")||venue.includes("pavilion")){
        totAmphitheatre++;
      }
    }

    addSongTally = function(venue, year){
      venue = venue.toLowerCase();
      if(venue.includes("fest")||venue.includes("festival")||venue.includes(year)){
        numFestival++;
      }
      else if(venue.includes("arena")||venue.includes("coliseum")||venue.includes("civic center")||venue.includes("bowl")){
        numArena++;
      }
      else if(venue.includes(" theatre")||venue.includes(" theater")||venue.includes("hall")){
        numTheatre++;
      }
      else if(venue.includes("amphitheatre")||venue.includes("amphitheater")||venue.includes("park")||venue.includes("pavilion")){
        numAmphitheatre++;
      }
    }

    arrayifyMonthData = function(monthData){
      var returnData= [];
      for (var key in monthData) {
        if (monthData.hasOwnProperty(key)) {
          returnData.push({
            month:key,
            timesPlayed:monthData[key]
          })
        }
      }
      return returnData;
    }

};
