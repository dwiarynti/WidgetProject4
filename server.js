//  OpenShift sample Node application
var express = require('express'),
  fs = require('fs'),
  app = express(),
  eps = require('ejs'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
  session = require('express-session');



//rocksdb
var level = require('level');

var ldb = level('./dbLevelTest', {
  valueEncoding: 'json'
})
//

//from app.js
app.use(express.static(path.join(__dirname, 'public')));

var location = require('./routes/location');
var widget = require('./routes/widget');
var employee = require('./routes/employee');
var locationsite = require('./routes/locationsite');
var site = require('./routes/site');
var appmanagement = require('./routes/appmanagement');
var person = require('./routes/person');
var device = require('./routes/device');
var persondevice = require('./routes/persondevice');
var personlocation = require('./routes/personlocation');
var user = require('./routes/user');
var auth = require('./routes/authenticationmanagement');
var message = require('./routes/message');
var room = require('./routes/room');
var roomdev = require('./routes/roomdev');
var personloc = require('./routes/personloc');
var widgetmanagement = require('./routes/widgetmanagement');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'ssshhhhh'
 
}))
//

// Routes (using rocksdb)
app.use('/api',location);
app.use('/api',widget);
app.use('/api',employee);
app.use('/api',locationsite);
app.use('/api',site);
app.use('/api',appmanagement);
app.use('/api',person);
app.use('/api',device);
app.use('/api',persondevice);
app.use('/api',personlocation);
app.use('/api',user);
app.use('/api',auth);
app.use('/api',message);
app.use('/api',room);
app.use('/api',roomdev);
app.use('/api',personloc);
app.use('/api',widgetmanagement);
//




Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'


var db = null, dbDetails = new Object();


app.get('/', function (req, res) {

  var counts = [];

  ldb.get('count', function (err, listobj) {
    console.log('listobj', listobj);

    if (listobj != undefined) {
      counts = listobj;
    } else {
      counts = [];
    }

    counts.push({ ip: req.ip, date: Date.now() });

    ldb.put('count', counts, function (err) {
      console.log('counts inside count', counts);

      dbDetails.databaseName = 'dbLevelTest';
      dbDetails.url = listobj;
      dbDetails.type = counts;
      res.render('index.html', { pageCountMessage: counts.length, dbInfo: dbDetails });

    })
  })

});

app.get('/pagecount', function (req, res) {

  ldb.get('count', function (err, obj) {
    console.log('obj on pagecount', obj);
    res.send('{ pageCount: ' + obj.length + '}');
  })

});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
