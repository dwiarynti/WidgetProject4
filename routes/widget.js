
var express = require('express');
var router = express.Router();

var db = require('./connection');


var masterdb = db.sublevel('master')
var widgetdb = db.sublevel('widget')


router.get('/widget/GetAll/',function(req, res) {
  
    widgetdb.get('listwidget', function(err, widgets){
       if (err) 
       if(err.message == "Key not found in database")
        {
            res.json({"success": true, "message": "no data" , "obj": []});
        }
        else
        {
              res.json(500,err);
        }
      else res.json({"obj": widgets});
    });
 
});

router.get('/widget/:_id', function (req, res) {
  var id = req.params._id;
  
  widgetdb.get('listwidget', function(err, widgets){
       if (err)
       if(err.message == "Key not found in database")
        {
            res.json({"success": true, "message": "no data" , "obj": []});
        }
        else
        {
              res.json(500,err);
        }
      else 
      {
        var item = {};
        for (var index = 0; index < widgets.length; index++) {
          var element = widgets[index];
          if (element.id == id) {
            item = element;
          }
        }
        res.json({"obj": item})
      };
    });

});

router.post('/widget/Create/', function (req, res) {
    console.log(req.body.obj);
    widgetdb.put('listwidget', {
      obj : req.body.obj
    }, function (err) {
      if (err) res.json(500, err)
      else res.json({ success: true });
    })

});


module.exports = router;

