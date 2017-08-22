var express = require('express');
var router = express.Router();

var db = require('./connection');

var appmanagementdb = db.sublevel('appmanagement');
var sequencedb = db.sublevel('sequencenumber');
var userdb = db.sublevel('user');
var widgetdb = db.sublevel('widgetmanagement');

appmanagementdb.get('appmanagement', function (err, app) {
    if (err) {
        //console.log('appmanagement', err);
        if (err.message == "Key not found in database") {
            appmanagementdb.put('appmanagement', [], function (err) {
                console.log('appmanagement data init');
            });
        }
    }
});

sequencedb.get('sequencenumber', function (err, seq) {
    if (err) {
        //console.log('sequencenumber', err);
        if (err.message == "Key not found in database") {
            sequencedb.put('sequencenumber', 0, function (err) {
                console.log('sequencenumber data init');
            });
        }
    }
});

router.post('/appmanagement/create', function (req, res) {
    var sequenceno = "";
    sequencedb.get('sequencenumber', function (err, no) {
        if (err)
            if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumber', no, function (err, no) {
                    if (err) res.json(500, err)
                    else sequenceno = no + 1;
                });
            }
            else {
                res.json(500, err);
            }
        else
            sequenceno = no + 1;

        if (sequenceno != "") {
            var app = {
                "id": sequenceno,
                "pagename": req.body.pagename,
                "pagestatus": req.body.pagestatus,
                "widget": req.body.widget
            }
            var listobj = [];
            appmanagementdb.get('appmanagement', function (err, obj) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }
                else
                    if (obj.length != 0) {
                        listobj = obj;
                        listobj.push(app);
                    }
                    else {
                        listobj.push(app);
                    }

                appmanagementdb.put('appmanagement', listobj, function (err, data) {
                    if (err) res.json(500, err);
                    else
                        sequencedb.put('sequencenumber', sequenceno, function (err, no) {
                            if (err) res.json(500, err)
                            else
                                res.json({ "success": true, "obj": app })
                        });

                })
            })

        }

    });
});

router.post('/appmanagement/update', function (req, res) {
    var listobj = [];

    appmanagementdb.get('appmanagement', function (err, obj) {
        if (err) res.json(500, err);
        else
            for (var i = 0; i < obj.length; i++) {

                if (obj[i].id == req.body.id) {
                    obj[i].pagename = req.body.pagename;
                    obj[i].pagestatus = req.body.pagestatus;
                    obj[i].widget = req.body.widget;
                }
                listobj.push(obj[i]);
            }

        if (listobj.length == obj.length) {
            appmanagementdb.put('appmanagement', listobj, function (err, data) {
                if (err)
                    res.json(500, err);
                else
                    res.json({ "success": true });
            });
        }
    });

})

router.get('/appmanagement/getall', function (req, res) {
    appmanagementdb.get('appmanagement', function (err, management) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }

        else res.json({ "success": true, "obj": management })
    });
});

router.get('/appmanagement/:_id', function (req, res) {
    var id = req.params._id;

    appmanagementdb.get('appmanagement', function (err, management) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var item = {};
        for (var index = 0; index < management.length; index++) {
            var element = management[index];
            if (element.id == id) {
                item = element;
            }
        }
        res.json({ "obj": item });
    });
})

router.get('/appmanagement/getbyuser/:_id',function(req,res)
{
    var userid = req.params._id;
    widgetdb.get('widgetmanagement', function (err, management) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }

        else
        userdb.get('user',function(err,data)
        {
            if(err)
            {
            if (err.message == "Key not found in database") {
                res.json({"success": true, "message": "no data", "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
            }
            else
            {
               var user = "";
               for(var a = 0; a< data.length;a++)
               {
                 if(data[a].id == userid)
                 {
                     user = data[a];
                 }
               }
                var result = [];
                var count = 0;
                if(user!= "")
                {
                for(var i = 0 ; i < management.length; i++)
                {
                    for(var j= 0; j < user.pages.length;j++)
                    {
                        if(management[i].id == user.pages[j])
                        {
                            result.push(management[i]);
                        }
                    }
                    count +=1;
                }
                if(count == management.length)
                {
                    res.json({"success":true, "obj": result});
                }
            }
            else
            {
                res.json({"success":true, "obj": result});
            }
         }
       });
    });
});

module.exports = router;