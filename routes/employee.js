
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
var employeedb = db.sublevel('employee')

// Data initialization
var emp = [
  {
    id: 5000,
    name: 'Andy Chatterton',
    location: 'Raquette River',
    image: 'employee-andy.png'
  },
  {
    id: 5001,
    name: 'April Donaldson',
    location: 'Saranac River',
    image: 'employee-april.png'
  },
  {
    id: 5002,
    name: 'Don Morgan',
    location: 'Black Creek',
    image: 'employee-don.png'
  },
  {
    id: 5003,
    name: 'Tom Sullivan',
    location: 'Ausable River',
    image: 'employee-tom.png'
  },
  {
    id: 5004,
    name: 'Kathy Fletcher',
    location: 'Batten Kill',
    image: 'employee-kathy.png'
  }
];

employeedb.get('listemployee', function (err, emps) {
  if (err) {
    //console.log('employee', err);
    if (err.message == "Key not found in database") {
      employeedb.put('listemployee', emp, function (err) {
        console.log('employee data init');
      });
    }
  }
});

router.get('/employee/GetAll/', function (req, res) {

  employeedb.get('listemployee', function (err, employees) {
    if (err)
      if (err.message == "Key not found in database") {
        res.json({ "success": true, "message": "no data", "obj": [] });
      }
      else {
        res.json(500, err);
      }
    else res.json({ "obj": employees });
  });

});

router.get('/employee/:_id', function (req, res) {
  var id = req.params._id;

  employeedb.get('listemployee', function (err, employees) {
    if (err)
      if (err.message == "Key not found in database") {
        res.json({ "success": true, "message": "no data", "obj": [] });
      }
      else {
        res.json(500, err);
      }
    else {
      var item = {};
      for (var index = 0; index < employees.length; index++) {
        var element = employees[index];
        if (element.id == id) {
          item = element;
        }
      }
      res.json({ "obj": item })
    };
  });

});


module.exports = router;

