var express = require('express');
var router = express.Router();

var db = require('./connection');
var roomdb = db.sublevel('room');
var sequencedb = db.sublevel('sequencenumberroom');
var roomdevdevicedb = db.sublevel('roomdevdevice');


router.post('/room/cleanup',function(req,res)
{
    var listobj = [];
    roomdb.put('room',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                 res.json({"success": true});
            }
        });
});

router.post('/room/create', function (req, res) {

    var generateid = "";
    var listobj = [];
    sequencedb.get('sequencenumberroom',function(err,id)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                generateid = 1;
            }
            else
            {
                res.json(500,err);
            }
        }
        else{
            generateid = id+1;
        }

    var parent;
    if( req.body.roomobj.parent != null)
    {
        parent =req.body.roomobj.parent;
    }
    else
    {
        parent = "";
    }
    var room = {
        uuid : generateid,
        name: req.body.roomobj.name,
        parent :parent,
        datecreated : req.body.roomobj.datacreated,
        datemodified : "",
        changeby : "",
        changebyname :"",
        areatype : req.body.roomobj.areatype,
        shortaddress: req.body.roomobj.shortaddress,
        fulladdress:req.body.roomobj.fulladdress,
        Location :"",
        disable : false
    }

    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                listobj.push(room);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(rooms.length > 0)
            {
                listobj = rooms;
                listobj.push(room);
            }
            else
            {
                
              listobj.push(room);
                
            }
        }

        roomdb.put('room',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
               sequencedb.put('sequencenumberroom',generateid,function(err)
                {
                    if(err)
                    {
                        res.json(500,err);
                    }
                    else
                    {
                        res.json({ "success": true })
                    }
                })
            }
        })
    });
});
});

router.get('/room/getall',function(req,res)
{
    var listobj = [];
     var room = {
        uuid :"",
        name: "",
        parent :"",
        datecreated : "",
        datemodified : "",
        changeby : "",
        changebyname :"",
        areatype :"",
        shortaddress: "",
        fulladdress:"",
        Location :"",
        disable : ""
    }
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database" )
            {
                listobj.push(room);
                res.json({"success": true , "obj": listobj});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].disable == false)
                {
                    rooms[i].parentname = "";
                    listobj.push(rooms[i]);
                }
            }

            for(var a = 0 ; a < listobj.length;a++)
            {
            for(var i = 0 ; i < listobj.length;i++)
            {
                if(listobj[i].parent != 0)
                {
                    if(listobj[i].parent == listobj[a].uuid)
                    {
                        listobj[i].parentname = listobj[a].name;
                    }
                }
                else
                {
                     listobj[i].parentname = "-";
                }
            }
        }
        if(listobj.length == 0)
        {
            listobj.push(room);
        }
            res.json({"success": true , "obj": listobj});
        }
    })
})

router.get('/room/get/:_id',function(req,res)
{
    var id = req.params._id;
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json(404,"not found");
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var selected;
            for(var i = 0 ; i < rooms.length;i++)
            {
                if(rooms[i].uuid == id)
                {
                    selected = rooms[i];
                }
            }
            if(selected != null)
            {
                res.json({"success":true, "obj": selected});
            }
            else
            {
                res.json({"success":true,"message":"not found"})
            }
        }
    })
});

router.post('/room/update',function(req,res)
{

    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json(404,"notfound")
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var parent ;
            if(req.body.roomobj.parent != null)
            {
                parent = req.body.roomobj.parent;
            }
            else    
            {
                parent = "";
            }
            for(var i = 0; i < rooms.length; i++)
            {
                if(rooms[i].uuid == req.body.roomobj.uuid)
                {
                    rooms[i].name = req.body.roomobj.name;
                    rooms[i].parent = parent;
                    rooms[i].datemodified = req.body.roomobj.datemodified;
                    rooms[i].changeby = req.body.roomobj.changeby;
                    rooms[i].changebyname = req.body.roomobj.changebyname;
                    rooms[i].shortaddress= req.body.roomobj.shortaddress;
                    rooms[i].fulladdress=req.body.roomobj.fulladdress;
                }
            }

            roomdb.put('room',rooms,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else{
                    res.json({"success": true})
                }
            })
        }
    })
    
})

router.post('/room/delete',function(req,res)
{
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json(404,"not found");
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            for(var i = 0; i < rooms.length;i++)
            {
                if(rooms[i].uuid == req.body.roomobj.uuid)
                {
                    rooms[i].disable = true;
                }
            }

            roomdb.put('room',rooms,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                    res.json({"success": true})
                }
            })
        }
    })
})

router.get('/room/gettyperoom',function(req,res)
{
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database" )
            {
                res.json({"success": true , "obj": []});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var listobj = [];
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].disable == false)
                {
                    if(rooms[i].areatype == "room")
                    {
                    rooms[i].parentname = "";
                    listobj.push(rooms[i]);
                    }
                }
            }
            
            for(var a = 0 ; a < listobj.length;a++)
            {
            for(var i = 0 ; i < listobj.length;i++)
            {
              
                if(listobj[i].parent != 0)
                {
                    if(listobj[i].parent == listobj[a].uuid)
                    {
                        listobj[i].parentname = listobj[a].name;
                    }
                }
                else
                {
                     listobj[i].parentname = "-";
                }

                
            }
            }
            res.json({"success": true , "obj": listobj});
        }
    })
})

router.get('/room/getsite/',function(req,res)
{
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database" )
            {
                res.json({"success": true , "obj": []});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var listobj = [];
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].disable == false)
                {
                    if(rooms[i].areatype == "site")
                    {
                    rooms[i].parentname = "";
                    listobj.push(rooms[i]);
                    }
                }
            }
            
            if(listobj.length == 0)
            {
                 res.json({"success": true , "obj": []});
            }
            else
            {
            for(var a = 0 ; a < listobj.length;a++)
            {
            for(var i = 0 ; i < listobj.length;i++)
            {
              
                if(listobj[i].parent != 0)
                {
                    if(listobj[i].parent == listobj[a].uuid)
                    {
                        listobj[i].parentname = listobj[a].name;
                    }
                }
                else
                {
                     listobj[i].parentname = "-";
                }

                
            }
            }
            res.json({"success": true , "obj": listobj});
            }
        }
    })
});

var getloc = function(id,callback)
{
    roomdb.get('room',function(err,rooms)
    {
        
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                var result = "0";
                return callback(result);
            }
            else
            {
                var result = "1";
                return callback(result);
            }
        }
        else
        {
            var listarea = [];
            var listresult = [];
            var parentname = "";
           
         
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].disable == false)
                {

                    if(rooms[i].uuid == id)
                    {
                        parentname = rooms[i].name;
                    }
                    if(rooms[i].parent == id)
                    {
                    rooms[i].parentname = parentname;
                    listresult.push(rooms[i]);
                    rooms[i].Building = [];
                    listarea.push(rooms[i]);
                    }
                }
            }

            if(listarea.length == 0)
            {
                var result = "0";
                return callback(result);
            }
            else
            {
                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        if(rooms[j].disable == false)
                        {
                            if(rooms[j].parent != 0)
                            {
                                if(rooms[j].parent == listarea[i].uuid)
                                {
                                    rooms[j].parentname = listarea[i].name;
                                    listresult.push(rooms[j]);
                                    rooms[j].Floor = [];
                                    listarea[i].Building.push(rooms[j]);
                                }
                            }
                        }
                    }
                }

                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        for(var k = 0 ; k < listarea[i].Building.length;k++)
                        {
                        if(rooms[j].disable == false)
                        {
                            if(rooms[j].parent != 0)
                            {
                            if(rooms[j].parent == listarea[i].Building[k].uuid)
                            {
                                rooms[j].parentname = listarea[i].name;
                                listresult.push(rooms[j]);
                                rooms[j].Zone = [];
                                listarea[i].Building[k].Floor.push(rooms[j]);
                            }
                            }
                        }
                        }
                    }
                }

                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        for(var k = 0 ; k < listarea[i].Building.length;k++)
                        {
                            for(var l = 0 ; l < listarea[i].Building[k].Floor.length; l++)
                            {
                            if(rooms[j].disable == false)
                            {
                                if(rooms[j].parent != 0)
                                {
                                if(rooms[j].parent == listarea[i].Building[k].Floor[l].uuid)
                                {
                                    rooms[j].parentname = listarea[i].name;
                                    listresult.push(rooms[j]);
                                    rooms[j].Room = [];
                                    listarea[i].Building[k].Floor[l].Zone.push(rooms[j]);
                                }
                                }
                            }
                            }
                        }
                    }
                }

                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        for(var k = 0 ; k < listarea[i].Building.length;k++)
                        {
                            for(var l = 0 ; l < listarea[i].Building[k].Floor.length; l++)
                            {
                                for(var m = 0 ; m < listarea[i].Building[k].Floor[l].Zone.length;m++)
                                {
                                    if(rooms[j].disable == false)
                                    {
                                        if(rooms[j].parent != 0)
                                        {
                                        if(rooms[j].parent == listarea[i].Building[k].Floor[l].Zone[m].uuid)
                                        {
                                            rooms[j].parentname = listarea[i].name;
                                            listresult.push(rooms[j]);
                                            rooms[j].Section = [];
                                            listarea[i].Building[k].Floor[l].Zone[m].Room.push(rooms[j]);
                                        }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        for(var k = 0 ; k < listarea[i].Building.length;k++)
                        {
                            for(var l = 0 ; l < listarea[i].Building[k].Floor.length; l++)
                            {
                                for(var m = 0 ; m < listarea[i].Building[k].Floor[l].Zone.length;m++)
                                {
                                    for(var n = 0 ; n < listarea[i].Building[k].Floor[l].Zone[m].Room.length; n++)
                                    {
                                    if(rooms[j].disable == false)
                                    {
                                        if(rooms[j].parent != 0)
                                        {
                                        if(rooms[j].parent == listarea[i].Building[k].Floor[l].Zone[m].Room[n].uuid)
                                        {
                                            rooms[j].parentname = listarea[i].name;
                                            listresult.push(rooms[j]);
                                            rooms[j].Closet = [];
                                            listarea[i].Building[k].Floor[l].Zone[m].Room[n].Section.push(rooms[j]);
                                        }
                                        }
                                    }
                                    }
                                }
                            }
                        }
                    }
                }

                for(var j = 0 ; j < rooms.length; j++)
                {
                    for(var i = 0 ; i < listarea.length; i++)
                    {
                        for(var k = 0 ; k < listarea[i].Building.length;k++)
                        {
                            for(var l = 0 ; l < listarea[i].Building[k].Floor.length; l++)
                            {
                                for(var m = 0 ; m < listarea[i].Building[k].Floor[l].Zone.length;m++)
                                {
                                    for(var n = 0 ; n < listarea[i].Building[k].Floor[l].Zone[m].Room.length; n++)
                                    {
                                        for(var o = 0 ; o < listarea[i].Building[k].Floor[l].Zone[m].Room[n].Section.length; o++)
                                        {
                                        if(rooms[j].disable == false)
                                        {
                                            if(rooms[j].parent != 0)
                                            {
                                            if(rooms[j].parent == listarea[i].Building[k].Floor[l].Zone[m].Room[n].Section[o].uuid)
                                            {
                                                rooms[j].parentname = listarea[i].name;
                                                listresult.push(rooms[j]);
                                                listarea[i].Building[k].Floor[l].Zone[m].Room[n].Section[o].Closet.push(rooms[j]);
                                            }
                                            }
                                        }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                var result = [];
                for(var i = 0 ; i < listresult.length; i++)
                {
                    var selected = {
                        uuid : listresult[i].uuid,
                        name:  listresult[i].name,
                        parent : listresult[i].parent,
                        parentname : listresult[i].parentname,
                        datecreated :  listresult[i].datacreated,
                        datemodified : listresult[i].datemodified,
                        changeby :  listresult[i].changeby,
                        changebyname :listresult[i].changebyname,
                        areatype :  listresult[i].areatype,
                        shortaddress: listresult[i].shortaddress,
                        fulladdress: listresult[i].fulladdress,
                        Location : listresult[i].Location,
                        disable :  listresult[i].disable

                    }
                    result.push(selected);
                }

                return callback(result);

            }
        }
    });
}
router.get('/room/getloc/:_id',function(req,res)
{
 var id = req.params._id;
 var listobj = [];
 var room = {
        uuid :"",
        name: "",
        parent :"",
        datecreated : "",
        datemodified : "",
        changeby : "",
        changebyname :"",
        areatype :"",
        shortaddress: "",
        fulladdress:"",
        Location :"",
        disable : ""
}
 var data = getloc(id,function(responsedata)
 {
     if(responsedata == "0")
     {
         listobj.push(room);
         res.json({"success": true , "obj":listobj});
     }
     else if(responsedata == "1")
     {
         res.json(500);
     }
     else
     {
         if(responsedata.length == 0)
         {
             listobj.push(room);
             res.json({"success": true , "obj": listobj});
         }
         else
         {
              res.json({"success": true , "obj": responsedata});
         }
        
     }
 })
});

router.get('/room/getdevice/:_id',function(req,res)
{

 var id = req.params._id;
 var listobj = [];
 var device = {
     euid: "",
     room: "",
     type:""
 }
 var data = getloc(id,function(responsedata)
 {
     if(responsedata == "0")
     {
         listobj.push(device);
         res.json({"success": true , "obj":listobj});
     }
     else if(responsedata == "1")
     {
         res.json(500);
     }
     else
     {
        if(responsedata.length == 0)
        {
            listobj.push(device);
            res.json({"success": true , "obj":listobj});
        }
        else
        {
        roomdb.get('room',function(err,room)
        {
            for(var i = 0 ; i < room.length;i++)
            {
                if(room[i].areatype == "site")
                {
                    responsedata.push(room[i]);
                }
            }

              roomdevdevicedb.get('roomdevdevice',function(err,devices)
        {
            if(err)
            {
                if(err.message == "Key not found in database")
                {
                    listobj.push(device);
                    res.json({"success": true , "obj":listobj});
                }
                else
                {
                    res.json(500,err);
                }
            }
            else
            {
                var listresult = [];
                    for(var i = 0 ; i < responsedata.length;i++)
                    {
                        for(var j = 0 ; j < devices.length; j++)
                        {
                            if(devices[j].type == "fixed")
                            {
                            if(devices[j].room == responsedata[i].uuid)
                            {
                                devices[j].roomname = responsedata[i].name;
                                listresult.push(devices[j]);
                            }
                            }
                        }
                    }
                    if(listresult.length == 0)
                    {
                         listobj.push(device);
                         res.json({"success": true , "obj":listobj});
                    }
                    else
                    {
                         res.json({"success": true , "obj":listresult});
                    }
               
            }
        });
        })
      
        }
     }
});
});
module.exports = router;