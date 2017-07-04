var express = require('express');
var router = express.Router();

var db = require('./connection');
var personlocationdb = db.sublevel('personlocation');
var sitedb = db.sublevel('site');
var devicedb = db.sublevel('device');
var persondb = db.sublevel('person');
var personlocation = [
    {
        id: 1,
        siteid: "001",
        personid: 1,
        deviceid: 1,
        lastseen: '5/29/2017',
        locationrow: '98493843328449'
    },
    {
        id: 2,
        siteid: "001",
        personid: 2,
        deviceid: 2,
        lastseen: '5/29/2017',
        locationrow: '98493843328448'
    },
    {
        id: 3,
        siteid: "003",
        personid: 3,
        deviceid: 3,
        lastseen: '5/29/2017',
        locationrow: '98493843328447'
    }
]

personlocationdb.get('personlocation', function (err, locs) {
    if (err) {
        //console.log('personlocation', err);
        if (err.message == "Key not found in database") {
            personlocationdb.put('personlocation', personlocation, function (err) {
                console.log('personlocation data init');
            });
        }
    }
});


router.post('/personlocation/create', function (req, res) {
    personlocationdb.put('personlocation', personlocation, function (err) {
        if (err)
            res.json(500, err)

        else
            res.json({ "success": true })

    });
})
router.get('/personlocation/getbysite/:_id', function (req, res) {
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
            personlocationdb.get('personlocation', function (err, datapersonlocation) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var countdevice = 0;
                var item = [];
                var listpersondevice = [];
                var listpersondevicename = [];
                var result = [];
                for (var x = 0; x < datapersonlocation.length; x++) {
                    var element = datapersonlocation[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;
                            obj.lastseen = element.lastseen;
                            obj.locationrow = element.locationrow;
                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersonlocation.length) {

                    devicedb.get('device', function (err, datadevice) {
                        if (err)
                            if (err.message == "Key not found in database") {
                                res.json({ "success": true, "message": "no data", "obj": [] });
                            }
                            else {
                                res.json(500, err);
                            }
                        else
                            for (var i = 0; i < datadevice.length; i++) {

                                for (var j = 0; j < listpersondevice.length; j++) {
                                    if (datadevice[i].id == listpersondevice[j].deviceid) {
                                        var obj = {};
                                        obj.id = listpersondevice[j].id;
                                        obj.siteid = listpersondevice[j].siteid;
                                        obj.sitename = listpersondevice[j].sitename;
                                        obj.personid = listpersondevice[j].personid;
                                        obj.deviceid = listpersondevice[j].deviceid;
                                        obj.devicename = datadevice[i].devicename;
                                        obj.lastseen = listpersondevice[j].lastseen;
                                        obj.locationrow = listpersondevice[j].locationrow;
                                        listpersondevicename.push(obj);
                                    }
                                }
                            }
                        persondb.get('person', function (err, dataperson) {
                            if (err)
                                if (err.message == "Key not found in database") {
                                    res.json({ "success": true, "message": "no data", "obj": [] });
                                }
                                else {
                                    res.json(500, err);
                                }
                            else
                                for (var a = 0; a < dataperson.length; a++) {
                                    for (var b = 0; b < listpersondevicename.length; b++) {
                                        if (dataperson[a].id == listpersondevicename[b].personid) {
                                            var obj = {};
                                            obj.id = listpersondevicename[b].id;
                                            obj.siteid = listpersondevicename[b].siteid;
                                            obj.sitename = listpersondevicename[b].sitename;
                                            obj.personid = listpersondevicename[b].personid;
                                            obj.deviceid = listpersondevicename[b].deviceid;
                                            obj.devicename = listpersondevicename[b].devicename;
                                            obj.lastseen = listpersondevicename[b].lastseen;
                                            obj.locationrow = listpersondevicename[b].locationrow;
                                            obj.personname = dataperson[a].name;

                                            result.push(obj);
                                        }
                                    }
                                }
                            res.json({ "success": true, "obj": result });


                        })

                    });

                }
            });
        }
        else {
            res.json(500, err);
        }
    });


});

router.get('/personlocation/:_id', function (req, res) {
    var id = req.params._id;

    personlocationdb.get('personlocation', function (err, datapersonlocation) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var person = {};

        for (var i = 0; i < datapersonlocation.length; i++) {
            if (datapersonlocation[i].id == id) {
                person = datapersonlocation[i];
            }
        }
        if (person != null || person != "") {

            devicedb.get('device', function (err, datadevice) {
                var countdevice = 0;
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }
                else
                    for (var a = 0; a < datadevice.length; a++) {
                        if (datadevice[a].id == person.deviceid) {
                            person.devicename = datadevice[a].devicename;
                        }
                        countdevice++;
                    }

                persondb.get('person', function (err, dataperson) {
                    if (err)
                        if (err.message == "Key not found in database") {
                            res.json({ "success": true, "message": "no data", "obj": [] });
                        }
                        else {
                            res.json(500, err);
                        }
                    else
                        for (var a = 0; a < dataperson.length; a++) {
                            if (dataperson[a].id == person.personid) {
                                person.personname = dataperson[a].name;
                            }

                        }
                    res.json({ "success": true, "obj": person })
                })


            })
        }

    });

});
router.get('/personlocation/distinct/:_id', function (req, res) {
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
            personlocationdb.get('personlocation', function (err, datapersonlocation) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var countdevice = 0;
                var item = [];
                var listpersondevice = [];
                var listpersondevicename = [];
                var result = [];
                for (var x = 0; x < datapersonlocation.length; x++) {
                    var element = datapersonlocation[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;
                            obj.lastseen = element.lastseen;
                            obj.locationrow = element.locationrow;
                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersonlocation.length) {

                    devicedb.get('device', function (err, datadevice) {
                        if (err)
                            if (err.message == "Key not found in database") {
                                res.json({ "success": true, "message": "no data", "obj": [] });
                            }
                            else {
                                res.json(500, err);
                            }
                        else
                            for (var i = 0; i < datadevice.length; i++) {

                                for (var j = 0; j < listpersondevice.length; j++) {
                                    if (datadevice[i].id == listpersondevice[j].deviceid) {
                                        var obj = {};
                                        obj.id = listpersondevice[j].id;
                                        obj.siteid = listpersondevice[j].siteid;
                                        obj.sitename = listpersondevice[j].sitename;
                                        obj.personid = listpersondevice[j].personid;
                                        obj.deviceid = listpersondevice[j].deviceid;
                                        obj.devicename = datadevice[i].devicename;
                                        obj.lastseen = listpersondevice[j].lastseen;
                                        obj.locationrow = listpersondevice[j].locationrow;
                                        listpersondevicename.push(obj);
                                    }
                                }
                            }
                        persondb.get('person', function (err, dataperson) {
                            if (err)
                                if (err.message == "Key not found in database") {
                                    res.json({ "success": true, "message": "no data", "obj": [] });
                                }
                                else {
                                    res.json(500, err);
                                }
                            else
                                var count = 0;
                            for (var a = 0; a < dataperson.length; a++) {
                                for (var b = 0; b < listpersondevicename.length; b++) {
                                    if (dataperson[a].id == listpersondevicename[b].personid) {
                                        var obj = {};
                                        obj.id = listpersondevicename[b].id;
                                        obj.siteid = listpersondevicename[b].siteid;
                                        obj.sitename = listpersondevicename[b].sitename;
                                        obj.personid = listpersondevicename[b].personid;
                                        obj.deviceid = listpersondevicename[b].deviceid;
                                        obj.devicename = listpersondevicename[b].devicename;
                                        obj.lastseen = listpersondevicename[b].lastseen;
                                        obj.locationrow = listpersondevicename[b].locationrow;
                                        obj.personname = dataperson[a].name;

                                        result.push(obj);
                                    }
                                }
                                count += 1;
                            }
                            if (count == dataperson.length) {
                                var dataresult = [];
                                for (var k = 0; k < result.length; k++) {
                                    if (dataresult.indexOf(result[k].devicename) === -1) {
                                        dataresult.push(result[k].devicename);
                                    }
                                }
                                res.json({ "obj": dataresult })
                            }


                        })

                    });

                }
            });
        }
        else {
            res.json(500, err);
        }
    });


});

router.post('/personlocation/filter/:_id', function (req, res) {
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
            personlocationdb.get('personlocation', function (err, datapersonlocation) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var countdevice = 0;
                var item = [];
                var listpersondevice = [];
                var listpersondevicename = [];
                var result = [];
                for (var x = 0; x < datapersonlocation.length; x++) {
                    var element = datapersonlocation[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;
                            obj.lastseen = element.lastseen;
                            obj.locationrow = element.locationrow;
                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersonlocation.length) {

                    devicedb.get('device', function (err, datadevice) {
                        if (err)
                            if (err.message == "Key not found in database") {
                                res.json({ "success": true, "message": "no data", "obj": [] });
                            }
                            else {
                                res.json(500, err);
                            }
                        else
                            for (var i = 0; i < datadevice.length; i++) {

                                for (var j = 0; j < listpersondevice.length; j++) {
                                    if (datadevice[i].id == listpersondevice[j].deviceid) {
                                        var obj = {};
                                        obj.id = listpersondevice[j].id;
                                        obj.siteid = listpersondevice[j].siteid;
                                        obj.sitename = listpersondevice[j].sitename;
                                        obj.personid = listpersondevice[j].personid;
                                        obj.deviceid = listpersondevice[j].deviceid;
                                        obj.devicename = datadevice[i].devicename;
                                        obj.lastseen = listpersondevice[j].lastseen;
                                        obj.locationrow = listpersondevice[j].locationrow;
                                        listpersondevicename.push(obj);
                                    }
                                }
                            }
                        persondb.get('person', function (err, dataperson) {
                            if (err)
                                if (err.message == "Key not found in database") {
                                    res.json({ "success": true, "message": "no data", "obj": [] });
                                }
                                else {
                                    res.json(500, err);
                                }
                            else
                                for (var a = 0; a < dataperson.length; a++) {
                                    for (var b = 0; b < listpersondevicename.length; b++) {
                                        if (dataperson[a].id == listpersondevicename[b].personid) {
                                            var obj = {};
                                            obj.id = listpersondevicename[b].id;
                                            obj.siteid = listpersondevicename[b].siteid;
                                            obj.sitename = listpersondevicename[b].sitename;
                                            obj.personid = listpersondevicename[b].personid;
                                            obj.deviceid = listpersondevicename[b].deviceid;
                                            obj.devicename = listpersondevicename[b].devicename;
                                            obj.lastseen = listpersondevicename[b].lastseen;
                                            obj.locationrow = listpersondevicename[b].locationrow;
                                            obj.personname = dataperson[a].name;

                                            result.push(obj);
                                        }
                                    }
                                }
                            var resultpersonlocation = [];
                            if (paramsdevicename != null) {
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].devicename == paramsdevicename) {
                                        resultpersonlocation.push(result[j]);
                                    }
                                }
                                res.json({ "success": true, "obj": resultpersonlocation });
                            }
                            else {
                                res.json({ "success": true, "obj": result });
                            }


                        })

                    });

                }
            });
        }
        else {
            res.json(500, err);
        }
    });


});
module.exports = router;