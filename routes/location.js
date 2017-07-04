
var express = require('express');
var router = express.Router();

var db = require('./connection');

// var level = require('levelup');
// var sublevel = require('level-sublevel')

// var db = sublevel(level('./db', {
//   db: require('leveldown'),
//   valueEncoding: 'json'
// }));

var masterdb = db.sublevel('master')
var locationdb = db.sublevel('location')

// Data initialization
var loc = [
  {
    id: 1000,
    name: 'Raquette River',
    temperature: 55,
    guides: 20,
    rafts: 18,
    vests: 200,
    image: 'river1.png'
  },
  {
    id: 1001,
    name: 'Black River',
    temperature: 53,
    guides: 36,
    rafts: 22,
    vests: 250,
    image: 'river2.png'
  },
  {
    id: 1002,
    name: 'Hudson River',
    temperature: 58,
    guides: 56,
    rafts: 40,
    vests: 500,
    image: 'river3.png'
  },
  {
    id: 1003,
    name: 'Hudson Gorge',
    temperature: 39,
    guides: 8,
    rafts: 10,
    vests: 40,
    image: 'river4.png'
  },
  {
    id: 1004,
    name: 'Saranac River',
    temperature: 32,
    guides: 8,
    rafts: 8,
    vests: 100,
    image: 'river1.png'
  },
  {
    id: 1005,
    name: 'Black Creek',
    temperature: 34,
    guides: 22,
    rafts: 12,
    vests: 230,
    image: 'river2.png'
  },
  {
    id: 1006,
    name: 'Batten Kill',
    temperature: 54,
    guides: 20,
    rafts: 24,
    vests: 420,
    image: 'river3.png'
  },
  {
    id: 1007,
    name: 'Ausable River',
    temperature: 38,
    guides: 12,
    rafts: 8,
    vests: 225,
    image: 'river4.png'
  }
];

locationdb.get('listlocation', function (err, locs) {
  if (err) {
    //console.log('location', err);
    if (err.message == "Key not found in database") {
      locationdb.put('listlocation', loc, function (err) {
        console.log('location data init');
      });
    }
  }
});


router.get('/location/GetAll/', function (req, res) {

  locationdb.get('listlocation', function (err, locations) {
    if (err) res.json(500, err);
    else res.json({ "obj": locations });
  });

});

router.get('/location/:_id', function (req, res) {
  var id = req.params._id;

  locationdb.get('listlocation', function (err, locations) {
    if (err) res.json(500, err);
    else {
      var item = {};
      for (var index = 0; index < locations.length; index++) {
        var element = locations[index];
        if (element.id == id) {
          item = element;
        }
      }
      res.json({ "obj": item })
    };
  });

});


module.exports = router;

