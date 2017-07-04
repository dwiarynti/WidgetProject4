var express = require('express');
var router = express.Router();

var db = require('./connection');
var devicedb = db.sublevel('device');
var sitedb = db.sublevel('site');

var device = [
    {
        id: 1,
        mac: 91290391021,
        devicename: "A",
        siteid: "001"

    },
    {
        id: 2,
        mac: 91290391022,
        devicename: "B",
        siteid: "001"

    },
    {
        id: 3,
        mac: 91290391023,
        devicename: "C",
        siteid: "002"

    },
    {
        id: 4,
        mac: 91290391024,
        devicename: "D",
        siteid: "002"

    }
]

devicedb.get('device', function (err, person) {
    if (err) {
        //console.log('device', err);
        if (err.message == "Key not found in database") {
            devicedb.put('device', device, function (err) {
                console.log('device data init');
            });
        }
    }
});

router.post('/device/create', function (req, res) {
    devicedb.put('device', device, function (err) {
        if (err) res.json(500, err);
        else res.json({ success: true });
    });
});

router.get('/device/getall', function (req, res) {
    devicedb.get('device', function (err, person) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }

        else res.json({ "success": true, "obj": device })
    });
});

router.get('/device/:_id', function (req, res) {
    var id = req.params._id;
    devicedb.get('device', function (err, datadevice) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var item = {};
        for (var index = 0; index < datadevice.length; index++) {
            var element = datadevice[index];
            if (element.id == id) {
                item = element;
            }
        }
        res.json({ "obj": item });

    });
});

router.get('/device/getbysite/:_id', function (req, res) {
    var id = req.params._id;
    var listitem = [];
    var sitename = {};
    sitedb.get('site', function (err, sites) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                    sitename = element.sitename;
            }
        if (sitename != "") {
            devicedb.get('device', function (err, datadevice) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var item = [];

                for (var x = 0; x < datadevice.length; x++) {
                    var element = datadevice[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};

                            obj.sitename = sitename;
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.mac = element.mac;
                            obj.devicename = element.devicename;

                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == datadevice.length) {
                    res.json({ "obj": item })
                }


            });
        }
        else {
            res.json(500, err);
        }
    });


});

router.get('/device/distinct/:_id', function (req, res) {
    var id = req.params._id;
    var listitem = [];
    var sitename = {};
    sitedb.get('site', function (err, sites) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                    sitename = element.sitename;
            }
        if (sitename != "") {
            devicedb.get('device', function (err, datadevice) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var item = [];

                for (var x = 0; x < datadevice.length; x++) {
                    var element = datadevice[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};

                            obj.sitename = sitename;
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.mac = element.mac;
                            obj.devicename = element.devicename;

                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == datadevice.length) {
                    var result = [];
                    for (var a = 0; a < item.length; a++) {
                        if (result.indexOf(item[a].devicename) === -1) {
                            result.push(item[a].devicename);
                        }
                    }
                    res.json({ "obj": result })
                }


            });
        }
        else {
            res.json(500, err);
        }
    });

});

router.post('/device/filter/:_id', function (req, res) {
    var id = req.params._id;
    var paramsdevicename = req.body.devicename;
    var listitem = [];
    var sitename = {};
    sitedb.get('site', function (err, sites) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                    sitename = element.sitename;
            }
        if (sitename != "") {
            devicedb.get('device', function (err, datadevice) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var item = [];

                for (var x = 0; x < datadevice.length; x++) {
                    var element = datadevice[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};

                            obj.sitename = sitename;
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.mac = element.mac;
                            obj.devicename = element.devicename;

                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == datadevice.length) {
                    if (paramsdevicename != null) {
                        var result = [];
                        for (var i = 0; i < item.length; i++) {
                            if (item[i].devicename == paramsdevicename) {
                                result.push(item[i]);
                            }
                        }
                        res.json({ "success": true, "obj": result });
                    }
                    else {
                        res.json({ "success": true, "obj": item });
                    }
                }


            });
        }
        else {
            res.json(500, err);
        }
    });
});
module.exports = router;