var express = require('express');
var router = express.Router();

var db = require('./connection');
var persondevicedb = db.sublevel('persondevice');
var sitedb = db.sublevel('site');
var devicedb = db.sublevel('device');
var persondb = db.sublevel('person');
var sequencedb = db.sublevel('sequencenumberpersondevice');
var persondevice = [
    {
        id: 1,
        siteid: "001",
        personid: 1,
        deviceid: 1,
    },
    {
        id: 2,
        siteid: "001",
        personid: 2,
        deviceid: 1,
    },
    {
        id: 3,
        siteid: "002",
        personid: 3,
        deviceid: 3,
    }
]

persondevicedb.get('persondevice', function (err, persons) {
    if (err) {
        //console.log('persondevice', err);
        if (err.message == "Key not found in database") {
            persondevicedb.put('persondevice', persondevice, function (err) {
                console.log('persondevice data init');
            });
        }
    }
});

router.post('/persondevice/create', function (req, res) {

    persondevicedb.put('persondevice', persondevice, function (err) {
        if (err)
            res.json(500, err)

        else
            res.json({ "success": true })

    });

});

router.post('/persondevice/createdevice', function (req, res) {
    var obj = req.body.obj;
    var sequanceno = "";
    sequencedb.get('sequencenumberpersondevice', function (err, no) {
        if (err)
            if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumberpersondevice', no, function (err, no) {
                    if (err) res.json(500, err)
                    else sequenceno = no + 1;
                });
            }
            else {
                res.json(500, err);
            }
        else
            sequanceno = no + 1;
        if (sequanceno != "") {
            var data = {
                "id": sequanceno,
                "personid": req.body.personid,
                "deviceid": req.body.deviceid,
                "siteid": req.body.siteid
            }
            var listobj = [];
            persondevicedb.get('persondb', function (err, obj) {
                if (err)
                    res.json(500, err);

                else
                    if (obj.length != 0) {
                        listobj = obj;
                        listobj.push(data);
                    }
                    else {
                        listobj.push(data);
                    }
                persondevicedb.put('persondevice', listobj, function (err) {
                    if (err)
                        res.json(500, err)

                    else
                        sequencedb.put('sequencenumberpersondevice', sequanceno, function (err, no) {
                            if (err) res.json(500, err)
                            else
                                res.json({ "success": true })
                        });

                });
            });
        }


    });
});

router.get('/persondevice/getbysite/:_id', function (req, res) {
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
            persondevicedb.get('persondevice', function (err, datapersondevice) {
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
                for (var x = 0; x < datapersondevice.length; x++) {
                    var element = datapersondevice[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;

                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersondevice.length) {

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

router.get('/persondevice/:_id', function (req, res) {
    var id = req.params._id;

    persondevicedb.get('persondevice', function (err, datapersondevice) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var person = {};

        for (var i = 0; i < datapersondevice.length; i++) {
            if (datapersondevice[i].id == id) {
                person = datapersondevice[i];
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

router.post('/persondevice/filter/:_id', function (req, res) {
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
            persondevicedb.get('persondevice', function (err, datapersondevice) {
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
                for (var x = 0; x < datapersondevice.length; x++) {
                    var element = datapersondevice[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;

                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersondevice.length) {

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
                                            obj.personname = dataperson[a].name;

                                            result.push(obj);
                                        }
                                    }
                                }
                            var resultpersondevice = [];
                            if (paramsdevicename != null) {
                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].devicename == paramsdevicename) {
                                        resultpersondevice.push(result[j]);
                                    }
                                }
                                res.json({ "success": true, "obj": resultpersondevice });
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
})

router.get('/persondevice/distinct/:_id', function (req, res) {
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
            persondevicedb.get('persondevice', function (err, datapersondevice) {
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
                for (var x = 0; x < datapersondevice.length; x++) {
                    var element = datapersondevice[x];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.sitename = sitename;
                            obj.personid = element.personid;
                            obj.deviceid = element.deviceid;

                            listpersondevice.push(obj);
                        }
                    }
                    index += 1;
                }

                if (index == datapersondevice.length) {

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
module.exports = router;