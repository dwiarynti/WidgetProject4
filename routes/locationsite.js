var express = require('express');
var router = express.Router();

var db = require('./connection');
var locationdb = db.sublevel('locationsite');
var sitedb = db.sublevel('site');
var loc = [
    {
        id: "001",
        siteid: "001",
        locationname: "Anjungan A",
        zone: "A"

    },
    {
        id: "002",
        siteid: "001",
        locationname: "Anjungan B",
        zone: "A"
    },
    ,
    {
        id: "003",
        siteid: "001",
        locationname: "Anjungan B",
        zone: "B"
    },
    {
        id: "004",
        siteid: "003",
        locationname: "Anjungan A",
        zone: "A"
    },
    {
        id: "005",
        siteid: "003",
        locationname: "Anjungan A",
        zone: "B"
    },
    {
        id: "006",
        siteid: "002",
        locationname: "Anjungan A",
        zone: "B"
    },
    {
        id: "007",
        siteid: "002",
        locationname: "Anjungan B",
        zone: "B"
    }
]

locationdb.get('locationsite', function (err, locs) {
    if (err) {
        //console.log('locationsite', err);
        if (err.message == "Key not found in database") {
            locationdb.put('locationsite', loc, function (err) {
                console.log('locationsite data init');
            });
        }
    }
});

router.get('/locationsite/getbysite/:_id', function (req, res) {
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
            locationdb.get('locationsite', function (err, locations) {
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

                for (var x = 0; x < locations.length; x++) {
                    var element = locations[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = { "sitename": "", "id": "", "locationname": "", "zone": "" };

                            obj.sitename = sitename;
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.locationname = element.locationname;
                            obj.zone = element.zone;
                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == locations.length) {
                    res.json({ "obj": item })
                }


            });
        }
        else {
            res.json(500, err);
        }
    });


});

router.get('/locationsite/getall', function (req, res) {
  
    var listitem = [];
    
    sitedb.get('site', function (err, sites) {
    if (err)
    {
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
    }
    else
    {
        locationdb.get('locationsite',function(err,locations)
        {
            if(err)
            {
                if (err.message == "Key not found in database") 
                {
                res.json({ "success": true, "message": "no data", "obj": [] });
                }
                else
                {
                res.json(500,err);
                }
            }
            else 
            {
                for(var i = 0 ; i < sites.length;i++)
                {
                    for(var x = 0 ; x < locations.length;x++)
                    {
                        if(locations[x] != null)
                        {
                        if(sites[i].id == locations[x].siteid)
                        {
                            locations[x].sitename = sites[i].sitename;
                        }
                        }
                    }
                }
                res.json({ "obj": locations })
            }
        })
    }
 });
});

router.post('/locationsite/create', function (req, res) {
    locationdb.put('locationsite', loc, function (err) {
        if (err) res.json(500, err);
        else res.json({ success: true });
    });
});

router.get('/locationsite/:_id', function (req, res) {
    var id = req.params._id;
    locationdb.get('locationsite', function (err, locations) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var item = {};
        for (var index = 0; index < locations.length; index++) {
            var element = locations[index];
            if (element.id == id) {
                item = element;
            }
        }
        res.json({ "obj": item });

    })
});

router.get('/locationsite/distinct/:_id', function (req, res) {
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
            locationdb.get('locationsite', function (err, locations) {
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

                for (var x = 0; x < locations.length; x++) {
                    var element = locations[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = { "sitename": "", "id": "", "locationname": "", "zone": "" };


                            obj.locationname = element.locationname;
                            obj.zone = element.zone;
                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == locations.length) {
                    var result = { "locations": [], "zone": [] };
                    for (var z = 0; z < item.length; z++) {
                        if (result.locations.indexOf(item[z].locationname) === -1) {
                            result.locations.push(item[z].locationname);
                        }
                        if (result.zone.indexOf(item[z].zone) === -1) {
                            result.zone.push(item[z].zone);
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

router.post('/locationsite/filter/:_id', function (req, res) {
    var id = req.params._id;
    var paramslocationname = req.body.locationname;
    var paramszone = req.body.zone;
    var listitem = [];
    var sitename = {};
    sitedb.get('site', function (err, sites) {
        if (err) res.json(500, err);
        else
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                    sitename = element.sitename;
            }
        if (sitename != "") {
            locationdb.get('locationsite', function (err, locations) {
                if (err) res.json(500, err);

                else
                    var index = 0;
                var item = [];


                for (var x = 0; x < locations.length; x++) {
                    var element = locations[index];
                    if (element != null) {

                        if (paramslocationname != null) {
                            if (element.siteid == id && element.locationname == paramslocationname) {
                                var obj = { "sitename": "", "id": "", "locationname": "", "zone": "" };
                                obj.sitename = sitename;
                                obj.id = element.id;
                                obj.siteid = element.siteid;
                                obj.locationname = element.locationname;
                                obj.zone = element.zone;
                                item.push(obj);
                            }
                        }
                        else if (paramszone != null) {
                            if (element.siteid == id && element.zone == paramszone) {
                                var obj = { "sitename": "", "id": "", "locationname": "", "zone": "" };
                                obj.sitename = sitename;
                                obj.id = element.id;
                                obj.siteid = element.siteid;
                                obj.locationname = element.locationname;
                                obj.zone = element.zone;
                                item.push(obj);
                            }
                        }
                        else {
                            if (element.siteid == id) {
                                var obj = { "sitename": "", "id": "", "locationname": "", "zone": "" };
                                obj.sitename = sitename;
                                obj.id = element.id;
                                obj.siteid = element.siteid;
                                obj.locationname = element.locationname;
                                obj.zone = element.zone;
                                item.push(obj);
                            }
                        }
                    }

                    index += 1;
                }
                if (index == locations.length) {
                    res.json({ "obj": item })
                }


            });
        }
        else {
            res.json(500, err);
        }
    });


});

module.exports = router;