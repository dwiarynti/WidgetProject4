var express = require('express');
var router = express.Router();

var db = require('./connection');
var devicedb = db.sublevel('device');
var sitedb = db.sublevel('site');
var roomdevroomdb = db.sublevel('roomdevroom');
var roomdevdevicedb = db.sublevel('roomdevdevice');
var decownpersondb = db.sublevel('decownperson');
var decowndevicedb = db.sublevel('decowndevice');
var personlocdb = db.sublevel('personloc');
var roomdb = db.sublevel('room');
var persondb = db.sublevel('person');


router.post('/roomdev/cleanup',function(req,res)
{
    var listobj = [];
    roomdevdevicedb.put('roomdevdevice',listobj,function(err)
    {
        if(err)
            {
                res.json(500,err);
            }
        else
            {
                res.json({"success":true})
            }
    });
})

router.get('/roomdev/getall',function(req,res)
{
    var listobj = [];
    var resultpersonloc = "";
    var resultroom = "";
    var resultperson = "";
    var data = {
        euid: "",
        room: "",
        type: "",
        person: "",
        roomname: "",
        personname: ""
    }
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            {
            var listdata = [];
            listdata.push(data);
            res.json({success:true,"obj": listdata});
            }
            else
            {
            res.json(500,err);
            }
        }
        else
        {
            for(var j = 0 ; j < roomdev.length;j++)
            {
                roomdev[j].roomname = "";
                roomdev[j].personname = "";
              
                listobj.push(roomdev[j]);  
            }

             personlocdb.get('personloc',function(err,personloc)
        {
            if(err)
            {
                if(err.message == "Key not found in database")
                    {
                        resultpersonloc = "0";
                    }
                else
                    {
                        resultpersonloc = "0";
                    }
            }
            else{
                resultpersonloc ="1";
            }

            if(resultpersonloc == "1")
            {
                for(var i = 0 ; i < personloc.length;i++)
                {
                    for(var j = 0 ; j < listobj.length;j++)
                        {
                            if(listobj[j].euid == personloc[i].uuid)
                            {
                                listobj[j].room = personloc[i].room;
                            }
                        }
                }
            }
            roomdb.get('room',function(err,rooms)
            {

                if(err)
                {
                    if(err.message == "Key not found in database")
                        {
                            resultroom = "0";
                        }
                    else
                        {
                            resultroom = "0";
                        }
                }
                else
                {
                    resultroom = "1";
                }

                if(resultroom == "1")
                {
                    for(var i = 0 ; i < rooms.length;i++)
                    {
                        for(var j = 0 ; j < listobj.length;j++)
                            {
                                if(listobj[j].room == rooms[i].uuid)
                                {
                                    listobj[j].roomname = rooms[i].name;
                                }
                            }
                    }
                }

                persondb.get('person', function (err, person) {
                    if (err)
                    {
                        if (err.message == "Key not found in database") {
                        resultperson = "0";
                        }
                        else {
                        
                            resultperson = "0";
                        }
                    }
                    else 
                    {
                        resultperson = "1";
                    }

                    if(resultperson == "1")
                    {
                        for(var i = 0 ; i < person.length;i++)
                        {
                            for(var j = 0 ; j < listobj.length;j++)
                                {
                                    if(listobj[j].type == "mobile")
                                    {
                                        if(person[i].uuid == listobj[j].person)
                                        {
                                            listobj[j].personname = person[i].name;
                                        }
                                    }
                                }
                        }
                    }
                    if(listobj.length > 0)
                    {
                    res.json({"success": true, "obj": listobj});
                    }
                    else
                    {
                    listobj.push(data);
                    res.json({"success" :true, obj : listobj})
                    }

                });


            });

        });
        }
       

    });
});

router.get('/roomdev/getdevicefix',function(req,res)
{
   
     var listobj = [];
     var device = {
     euid: "",
     room: "",
     type:""
    }
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            {
            listobj.push(device);
            res.json({success:true,"obj": listobj});
            }
            else
            {
            res.json(500,err);
            }
        }
        else
        {
           roomdb.get('room',function(err,rooms)
           {
            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < roomdev.length;j++)
                {
                   
                    if(roomdev[j].room == rooms[i].uuid)
                    {
                        roomdev[j].roomname = rooms[i].name;
                        if(roomdev[j].type == "fixed")
                        {
                        listobj.push(roomdev[j]);
                        }
                    }
                   
                    
                    
                }
            }
            if(listobj.length == 0)
            {
                listobj.push(device);
                res.json({"success" : true ,"obj": listobj })
            }
            else
            {
            res.json({"success" : true ,"obj": listobj })
            }
           });
        }

    });
});

var getdevice = function(id,callback)
{
    var listobj = [];
    var resultpersonloc = "";
    var resultroom = "";
    var resultperson = "";
    var result = {
        status :"",
        listobj : []
    }
    var data = {
        euid: "",
        room: "",
        type: "",
        person: "",
        roomname: "",
        personname: ""
    }
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            {
            var listdata = [];
            listdata.push(data);
            result.status = "0";
            result.listobj = listdata;
            return callback(result);
            }
            else
            {
            var listdata = [];
            listdata.push(data);
            result.status = "0";
            result.listobj = listdata;
            return callback(result);
            }
        }
        else
        {
            for(var j = 0 ; j < roomdev.length;j++)
            {
                roomdev[j].roomname = "";
                roomdev[j].personname = "";
              
                listobj.push(roomdev[j]);  
            }
        }
        personlocdb.get('personloc',function(err,personloc)
        {
            if(err)
            {
                if(err.message == "Key not found in database")
                    {
                        resultpersonloc = "0";
                    }
                else
                    {
                        resultpersonloc = "0";
                    }
            }
            else{
                resultpersonloc ="1";
            }

            if(resultpersonloc == "1")
            {
                for(var i = 0 ; i < personloc.length;i++)
                {
                    for(var j = 0 ; j < listobj.length;j++)
                        {
                            if(listobj[j].euid == personloc[i].uuid)
                            {
                                listobj[j].room = personloc[i].room;
                            }
                        }
                }
            }
            roomdb.get('room',function(err,rooms)
            {

                if(err)
                {
                    if(err.message == "Key not found in database")
                        {
                            resultroom = "0";
                        }
                    else
                        {
                            resultroom = "0";
                        }
                }
                else
                {
                    resultroom = "1";
                }

                if(resultroom == "1")
                {
                    for(var i = 0 ; i < rooms.length;i++)
                    {
                        for(var j = 0 ; j < listobj.length;j++)
                            {
                                if(listobj[j].room == rooms[i].uuid)
                                {
                                    listobj[j].roomname = rooms[i].name;
                                }
                            }
                    }
                }

                persondb.get('person', function (err, person) {
                    if (err)
                    {
                        if (err.message == "Key not found in database") {
                        resultperson = "0";
                        }
                        else {
                        
                            resultperson = "0";
                        }
                    }
                    else 
                    {
                        resultperson = "1";
                    }

                    if(resultperson == "1")
                    {
                        for(var i = 0 ; i < person.length;i++)
                        {
                            for(var j = 0 ; j < listobj.length;j++)
                                {
                                    if(listobj[j].type == "mobile")
                                    {
                                        if(person[i].uuid == listobj[j].person)
                                        {
                                            listobj[j].personname = person[i].name;
                                        }
                                    }
                                }
                        }
                    }
                    if(listobj.length > 0)
                    {
                        result.status = "1";
                        result.listobj = listobj;
                        return callback(result);
                    }
                    else
                    {
                         listobj.push(data);
                        result.status = "0";
                        result.listobj = listobj;
                        return callback(result);
                    }

                });


            });

        });

    });
}
router.get('/roomdev/getdevicemobile',function(req,res)
{
     var listobj = [];
     var device = {
     euid: "",
     room: "",
     type:""
    }
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            {
            listobj.push(device);
            res.json({success:true,"obj": listobj});
            }
            else
            {
            res.json(500,err);
            }
        }
        else
        {
            for(var i = 0 ; i < roomdev.length;i++)
            {
                if(roomdev[i].type == "mobile")
                    {
                        listobj.push(roomdev[i]);
                    }
            }
           res.json({success:true,"obj": listobj});
        }

    });
})

router.get('/roomdev/getbylocation/:_id',function(req,res)
{
    var locid = req.params._id;
    var datadevice = {
        euid: "",
        room: "",
        type: "",
        person: "",
        roomname: "",
        personname: ""
    }
    var data = getdevice(locid,function(responsedata)
    {
        if(responsedata.status == "0")
        {
            res.json({"success": true , "obj":responsedata.listobj});
        }
        else
        {
            var result = [];
            for(var i = 0 ; i < responsedata.listobj.length; i++)
            {
                if(responsedata.listobj[i].room == locid)
                {
                    result.push(responsedata.listobj[i])
                }
            }
            if(result.length > 0)
            {
            res.json({"success": true , "obj":result});
            }
            else
            {
            result.push(datadevice);
            res.json({"success": true , "obj":result});
            }
        }
    });
});

router.get('/roomdev/getroom',function(req,res)
{
    roomdevroomdb.get('roomdevroom',function(err,data)
    {
        if(err)
        res.json(500,err);
        else
        res.json({"success":true,"obj": data});
    })
});

router.post('/roomdev/delete',function(req,res)
{
    var devices = req.body.deviceobj;
   
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            res.json({success:true,"obj": {}});
            else
            res.json(500,err);
        }
        else
        {
          var listobj = [];
          var listroom = [];
          var result = [];
          for(var j = 0 ; j < roomdev.length;j++)
          {
            if(roomdev[j].euid != devices.euid)
            {
              listobj.push(roomdev[j])
            }
          }
          roomdevdevicedb.put('roomdevdevice',listobj,function(err)
          {
            if(err)
                res.json(500,err);
            else

            if(devices.type == "fixed")
            {
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
                {
                    var roomdata = {
                        room : devices.room,
                        version: devices.version,
                        device :[]
                    }
                   if(roomroom.length > 0)
                    {
                        for(var i = 0 ; i < roomroom.length; i++)
                        {
                            if(roomroom[i].room == devices.room)
                            {
                                for(var j = 0 ; j < roomroom[i].device.length;j++)
                                {
                                    if(roomroom[i].device[j] != devices.euid)
                                    {
                                         roomdata.device.push(roomroom[i].device[j]);
                                    }
                                }
                            }
                        }

                        for(var i = 0 ; i < roomroom.length;i++)
                        {
                            if(roomroom[i].room == roomdata.room)
                            {
                                roomroom[i].device = roomdata.device;
                            }
                        }
                        }
                else
                {
                    if(roomroom.room == devices.room)
                    {
                        for(var i  = 0 ; i < roomroom.device.length;i++)
                            {
                                if(roomroom.device[i] != devices.euid)
                                  {
                                      roomdata.device.push(roomroom.device[i]);
                                  }
                              }
                              roomroom.device = roomdata.device;
                    }
                }
                
                roomdevroomdb.put('roomdevroom',roomroom,function(err)
                    {
                        if(err)
                        res.json(500,err);
                        else
                        res.json({"success": true })
                    });

                });
            }
            else
            {
                res.json({"success":true});
            }

          });
          

        }
        
        
    });
});

router.post('/roomdev/update',function(req,res)
{
    var devices = req.body.deviceobj;
    var listobj = [];
    var listroom = [];
    var result = [];

    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success": false, "obj": {}});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var checkeuid = "";
            for(var j = 0 ; j < roomdev.length;j++)
            {
                              
                if(roomdev[j].euid == devices.prevdeviceobj.euid)
                {
                    checkeuid = roomdev.filter(p=>p.euid === devices.euid && p.room === devices.room);
                    roomdev[j].euid = devices.euid;
                    roomdev[j].room = devices.room;
                    roomdev[j].type = devices.type;
                    roomdev[j].person = devices.person;
                    
                }   
            }
            if(checkeuid.length > 0)
            {
                res.json({"success": false,"message":"mac address already exists"})
            }
            else
            {
                if(devices.type == "fixed")
                {
                    roomdevroomdb.get('roomdevroom',function(err,roomroom)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                res.json({"success": false, "obj": {}});
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                            if(roomroom.length > 0)
                                {
                                    for(var i = 0 ; i < roomroom.length; i++)
                                    {
                                        if(roomroom[i].room == devices.room)
                                        {
                                            for(var j = 0 ; j < roomroom[i].device.length;j++)
                                            {
                                                if(roomroom[i].device[j] == devices.euid)
                                                {
                                                    roomroom[i].device[j] = devices.euid;
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if(roomroom.room == devices.room)
                                    {
                                        for(var i  = 0 ; i < roomroom.device.length;i++)
                                        {
                                                if(roomroom.device[i] == devices.euid)
                                                {
                                                    roomroom.device[i] = devices.euid;
                                                }
                                        
                                        }
                                    }
                                }

                            roomdevdevicedb.put('roomdevdevice',roomdev,function(err)
                            {
                                if(err)
                                {
                                    res.json(500,err);
                                }
                                else
                                {
                                    roomdevroomdb.put('roomdevroom',roomroom,function(err)
                                    {
                                        if(err)
                                        res.json(500,err);
                                        else
                                        res.json({"success": true })
                                    });
                                }
                            });
                        }
                        
                    });
                }
                else
                {
                    var checkerror = false;
                    decowndevicedb.get('decowndevice',function(err,owndevice)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                checkerror = true;
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                            for(var i = 0 ; i < owndevice.length;i++)
                                    {
                                        if(owndevice[i].uuid == devices.prevdeviceobj.euid)
                                        {
                                            owndevice[i].uuid == devices.euid;
                                            owndevice[i].person = devices.person;
                                        }
                                }
                            checkerror = false;
                        }

                        decownpersondb.get('decownperson',function(err,ownperson)
                        {
                            if(err)
                            {
                                if(err.message == "Key not found in database")
                                {
                                    checkerror = true;
                                }
                                else
                                {
                                    res.json(500,err);
                                }
                            }
                            else
                            {
                                for(var i = 0; i < ownperson.length;i++)
                                {
                                    if(ownperson[i].person == devices.prevdeviceobj.person)
                                    {
                                                var result = "";
                                                ownperson[i].person = devices.person;
                                                result = ownperson[i].device.filter(x => x === devices.euid)
                                                if(result == "")
                                                {
                                                ownperson[i].device.push(devices.euid); 
                                                }
                                    }
                                }
                                for(var i = 0; i < ownperson.length;i++)
                                {
                                    if(ownperson[i].person == devices.prevdeviceobj.person)
                                    {
                                                var result = "";
                                                ownperson[i].person = devices.person;
                                                result = ownperson[i].device.filter(x => x === devices.euid)
                                                if(result == "")
                                                {
                                                ownperson[i].device.push(devices.euid); 
                                                }
                                    }
                                }
                                roomdevdevicedb.put('roomdevdevice',roomdev,function(err)
                                {
                                decowndevicedb.put('decowndevice',owndevice,function(err)
                                {
                                    if(err)
                                    {
                                        res.json(500,err);
                                    }
                                    else
                                    {
                                        decownpersondb.put('decownperson',ownperson,function(err)
                                        {
                                            if(err)
                                            {
                                                res.json(500,err);
                                            }
                                            else
                                            {
                                                res.json({"success": true })
                                            }
                                        });            

                                    }
                                });
                                });

                            }
                        });
                    });
                }
            }


           

        }
    });

});

var setdevice = function(obj,callback)
{
    var listdevice = [];
    
    for(var i = 0 ; i < obj.device.length;i++)
    {
        var deviceobj = {
        "euid" : "",
        "room" : "",
        "type" : ""
        }
        deviceobj.euid =  obj.device[i].euid;
        deviceobj.room = obj.room;
        deviceobj.type = obj.type;
        listdevice.push(deviceobj);
    }
    return callback(listdevice);
}

router.post('/roomdev/create',function(req,res)
{
    var obj = req.body.deviceobj;
    var listdevice = [];
    var listdeviceresult = [];
    var listroomresult = [];
    var deviceobj = {
        "euid" : "",
        "room" : "",
        "type" : ""
    }
    var roomdevobj = {
        "room" : "",
        "version" : 1,
        "device" : []
    }
    roomdevdevicedb.get('roomdevdevice',function(err,devices)
    {
       if(err)
        {
            if(err.message == "Key not found in database")
            {
               var data = setdevice(obj,function(responsedata)
               {
                   if(responsedata !=null)
                    {
                        listdevice = responsedata;
                    }
               });
   
            }
            else
            {
                var data = setdevice(obj,function(responsedata)
               {
                   if(responsedata !=null)
                    {
                        listdevice = responsedata;
                    }
               });
            }
        }
        else
        {
            var data = setdevice(obj,function(responsedata)
            {
                   if(responsedata !=null)
                    {
                        listdevice = responsedata;
                    }
            });
        }

        if(devices != null)
        {
            for(var i = 0 ; i < listdevice.length;i++)
            {
                var result = "";
                result = devices.filter(x => x.room === listdevice[i].room && x.euid === listdevice[i].euid);
                if(result == "")
                {
                    devices.push(listdevice[i]);
                }
            }
            
        }
        else
        {
            for(var i = 0 ; i < listdevice.length;i++)
            {
               
                devices.push(listdevice[i]);
                
            }
        }
        
        roomdevroomdb.get('roomdevroom',function(err,rooms)
        {
            if(err)
            {
                if(err.message == "Key not found in database")
                {
                    roomdevobj.room = obj.room;
                    for(var i = 0 ; i < obj.device.length;i++)
                    {
                        roomdevobj.device.push(obj.device[i].euid);
                    }
                    listroomresult.push(roomdevobj);
                }
                else
                {
                    roomdevobj.room = obj.room;
                    for(var i = 0 ; i < obj.device.length;i++)
                    {
                        roomdevobj.device.push(obj.device[i].euid);
                    }
                    listroomresult.push(roomdevobj);
                }
            }
            else
            {
                var selectroom = "";
                for(var i = 0 ; i < rooms.length;i++)
                {
                    if(rooms[i].room == obj.room)
                    {
                        selectroom = rooms[i];
                    }
                }
                if(selectroom != "")
                {
                    for(var i = 0 ; i < obj.device.length;i++)
                    {
                        var selected ="";
                        selected = selectroom.device.filter(x=>x === obj.device[i].euid);
                        if(selected == "" || selected.length == 0)
                        {
                            selectroom.device.push(obj.device[i].euid);
                        }
                    }
                    roomdevobj = selectroom;
                }
                else
                {
                    roomdevobj.room = obj.room;
                    for(var i = 0 ; i < obj.device.length;i++)
                     {
                        roomdevobj.device.push(obj.device[i].euid);
                     }
                }

                for(var i = 0 ; i < rooms.length;i++)
                {
                    if(rooms[i].room == roomdevobj.room)
                    {
                        rooms[i].device = roomdevobj.device;
                    }
                }
                listroomresult = rooms;
            }

        
        roomdevdevicedb.put('roomdevdevice',devices,function(err)
        {
            if(err)
            {
                res.json(500,err)
            }
            else
            {
                 roomdevroomdb.put('roomdevroom',listroomresult,function(err)
                 {
                    if(err)
                    {
                        res.json(500,err);
                    }
                    else
                        {
                            res.json({"success":true});
                        }
                 });
            }
            })
        })
    });

});




module.exports = router;