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


router.post('/roomdev/create',function(req,res)
{
    var listobj = [];
    var listroom = [];
    var selectdevice = "";
    var select = "";
    var devices  = {
        euid : req.body.deviceobj.euid,
        room : req.body.deviceobj.room,
        type : req.body.deviceobj.type,
        person : req.body.deviceobj.person
    }

    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            listobj.push(devices);
            else
            res.json(500,err);
            
        }
        else
        {
           if(roomdev.length > 0)
           {
                for(var a = 0 ;a< roomdev.length;a++)
                {
                    if(roomdev[a].euid == devices.euid)
                    {
                        select =  roomdev[a].euid;
                    }
                }
               listobj = roomdev;
               listobj.push(devices);
           }
           else
           {
               if(roomdev.euid == devices.euid)
               {
                   select =  roomdev.euid
               }
               listobj.push(devices);
           }
        }
       
      
        if(select == "")
        {
        roomdevdevicedb.put('roomdevdevice',listobj,function(err)
        {
            if(err)
            res.json(500,err);
            else
            if(devices.type == "fixed")
            {
                var room = {
                    room : devices.room,
                    version : 1,
                    device  :[]
                }
                room.device.push(devices.euid);
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
                {
                    var result = [];
                    
                    if(err)
                    {
                        if(err.message == "Key not found in database")
                        {
                            listroom.push(room);
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
                                roomroom[i].device.push(devices.euid);
                                selectdevice = roomroom[i];
                            }
                        }
                        }
                        else
                        {
                            if(roomroom.room == devices.room)
                            {
                                roomroom.device.push(devices.euid);
                                result.push(roomroom);
                            }
                            else
                            {
                                result[0] = roomroom;
                                result.push(room);
                            }
                            
                            selectdevice = roomroom;
                        }
                    }
                    if(selectdevice != "")
                    {
                        listroom = result;
                    }
                    else
                    {
                        listroom = room;
                    }
                    roomdevroomdb.put('roomdevroom',listroom,function(err)
                    {
                        if(err)
                        res.json(500,err);
                        else
                        res.json({"success": true })
                    });

                })
            }
            else
            {
            var listownperson = [];
            var person  = {
                    person : devices.person,
                    version: 1,
                    device : []
            }
            person.device.push(devices.euid);
            decowndevicedb.get('decowndevice',function(err,owndevice)
            {
                var listowndev = [];
                var devown ={
                    uuid : devices.euid,
                    person: devices.person
                }
                if(err)
                    {
                        if(err.message == "Key not found in database")
                            {
                                listowndev.push(devown);
                            }
                        else
                            {
                                res.json(500,err);
                            }
                    }
                else
                    {
                        if(owndevice.length > 0)
                            {
                                listowndev = owndevice;
                                listowndev.push(devown);
                            }
                        else
                            {
                                  listowndev.push(devown);
                            }
                    }
            decownpersondb.get('decownperson',function(err,ownperson)
            {
                if(err)
                    {
                        if(err.message == "Key not found in database")
                            {
                                listownperson.push(person);
                            }
                        else{
                            res.json(500,err);
                        }
                    }
                else{
                    if(ownperson.length > 0 )
                        {
                            listownperson = ownperson;
                            listownperson.push(person);
                        }
                    else
                        {
                            listownperson.push(person);
                        }
                   }
            decowndevicedb.put('decowndevice',listowndev,function(err)
            {
                if(err)
                    {
                        res.json(500,err);
                    }
                else
                    {
                        decownpersondb.put('decownperson',listownperson,function(err)
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
                
            });
               
            }
        })
        }
        else
        {
            res.json({"success" : false ,"messages": "mac address already exist"  })
        }
    });
});

router.get('/roomdev/getall',function(req,res)
{
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
            var listpersonloc = [];
            var listmobile = [];
            var listresult = [];
           roomdb.get('room',function(err,rooms)
           {
            
            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < roomdev.length;j++)
                {
                  
                   if(roomdev[j].type == "fixed")
                    {    
                        roomdev[j].roomname = rooms[i].name;
                        roomdev[j].person = "";
                                       
                        listresult.push(roomdev[j]);
                    }

                    else
                    {
                        roomdev[j].room = "";
                        roomdev[j].roomname = "";  
                        listmobile.push(roomdev[j])
                    }   
                }
            }

        var resultpersonloc = "";
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

            if(resultpersonloc  == "1")
            {
            for(var i = 0 ; i < personloc.length;i++)
                {
                    for(var j = 0; j < listmobile.length;j++)
                        {
                            if(personloc.uuid == listmobile.uuid)
                            {
                                listmobile[j].room = personloc[i].room;
                            }
                            listresult.push(listmobile[j]);
                        }
                }
            }
            else
            {
                for(var i = 0 ; i < listmobile.length;i++)
                    {
                        listresult.push(listmobile[i]);
                    }
            }
        res.json({"success" : true ,"obj": listresult })

        })
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
           res.json(listobj);
        }

    });
})

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
            if(roomdev[j].euid == devices.euid)
            {
              roomdev[j].room = devices.room;
              roomdev[j].type = devices.type;
            
            }
          }
          roomdevdevicedb.push('roomdevdevice',roomdev,function(err)
          {
            if(err)
                res.json(500,err);
            else

            if(devices.type == "fixed")
            {
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
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


module.exports = router;