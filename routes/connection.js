

var level = require('level');
var sublevel = require('level-sublevel')

// var db = monk('escuser:esc123@ds133331.mlab.com:33331/quiz_db');
var db = sublevel(level('/nodejsdata', {
// var db = sublevel(level('./db', {
  //db: require('leveldown'),
  valueEncoding: 'json'
}));

module.exports = db;
