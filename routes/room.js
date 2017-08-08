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
        disable : "",
        children: []
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
       
        var result = [];
        for(var i = 0 ; i < listobj.length;i++)
        {
            if(listobj[i].areatype == "site")
            {
                var selectedsite = listobj[i];
                selectedsite.children = [];
                result.push(selectedsite);
            }
        }

        for(var i = 0 ; i < listobj.length;i++)
        {
            for(var j = 0; j < result.length;j++)
            {
                if(listobj[i].parent == result[j].uuid)
                {
                    var selectedArea = listobj[i];
                    selectedArea.children = [];
                    result[j].children.push(selectedArea);
                }
            }
        }

        for(var i = 0 ; i < listobj.length;i++)
        {
            for(var j = 0; j < result.length;j++)
            {
                for(var r = 0 ; r < result[j].children.length; r++)
                {
                if(listobj[i].parent == result[j].children[r].uuid)
                {
                    var selectedBuilding = listobj[i];
                    selectedBuilding.children = [];
                    result[j].children[r].children.push(selectedBuilding);
                }
                }
            }
        }

        for(var i = 0 ; i < listobj.length;i++)
        {
            for(var j = 0; j < result.length;j++)
            {
                for(var r = 0 ; r < result[j].children.length; r++)
                {
                    for(var s = 0; s < result[j].children[r].children.length; s++ )
                    {
                        if(listobj[i].parent == result[j].children[r].children[s].uuid)
                        {
                            var selectedFloor = listobj[i];
                            selectedFloor.children = [];
                            result[j].children[r].children[s].children.push(selectedFloor);
                        }
                    }
                }
            }
        }

        for(var i = 0 ; i < listobj.length;i++)
        {
            for(var j = 0; j < result.length;j++)
            {
                for(var r = 0 ; r < result[j].children.length; r++)
                {
                    for(var s = 0; s < result[j].children[r].children.length; s++ )
                    {
                        for(var t = 0; t < result[j].children[r].children[s].children.length;t++)
                        {
                            if(listobj[i].parent == result[j].children[r].children[s].children[t].uuid)
                            {
                                var selectedRoom = listobj[i];
                                selectedRoom.children = [];
                                result[j].children[r].children[s].children[t].children.push(selectedRoom);
                            }
                        }
                        
                    }
                }
            }
        }

        for(var i = 0 ; i < listobj.length;i++)
        {
            for(var j = 0; j < result.length;j++)
            {
                for(var r = 0 ; r < result[j].children.length; r++)
                {
                    for(var s = 0; s < result[j].children[r].children.length; s++ )
                    {
                        for(var t = 0; t < result[j].children[r].children[s].children.length;t++)
                        {
                            for(var x = 0 ; x < result[j].children[r].children[s].children[t].children.length;x++ )
                            {
                                if(listobj[i].parent == result[j].children[r].children[s].children[t].children[x].uuid)
                                {
                                    var selectedCloset= listobj[i];
                                    result[j].children[r].children[s].children[t].children[x].children.push(selectedCloset);
                                }
                            }
                            
                        }
                        
                    }
                }
            }
        }




        if(result.length == 0)
        {
            result.push(room);
        }
        res.json({"success": true , "obj": result});
        }
    })
});



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
            var listdeleted = [];
            var listresult = [];
            for(var i = 0; i < rooms.length;i++)
            {
                if(rooms[i].uuid == req.body.roomobj.uuid)
                {
                    listdeleted.push(rooms[i]);
                }
            }
            
            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < listdeleted.length;j++)
                {
                    if(rooms[i].parent == listdeleted[j].uuid)
                    {
                        listdeleted.push(rooms[i]);
                       
                    }
                }
            }

            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < listdeleted.length;j++)
                {
                    if(rooms[i].uuid == listdeleted[j].uuid)
                    {
                      
                       rooms.splice(i,1);
                    }
                }
               
            }
           

            var result = rooms;
            roomdb.put('room',result,function(err)
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
           
            var listresult = [];
            var parentname = "";
           
         
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].uuid == id)
                {
                        parentname = rooms[i].name;
                }
                if(rooms[i].parent == id)
                {
                    rooms[i].parentname = parentname;
                    rooms[i].children = [];
                    listresult.push(rooms[i]);
                }
                
            }

            if(listresult.length == 0)
            {
                var result = "0";
                return callback(result);
            }
            else
            {   
                for(var i = 0; i < rooms.length;i++)
                {
                    for(var j = 0 ; j < listresult.length;j++)
                    {
                        if(listresult[j].uuid == rooms[i].parent)
                        {
                            var selectedBuilding = rooms[i];
                            selectedBuilding.children = [];
                            selectedBuilding.parentname = listresult[j].name;
                            listresult[j].children.push(selectedBuilding);
                        }
                    }
                }
                for(var i = 0; i < rooms.length;i++)
                {
                    for(var j = 0 ; j < listresult.length;j++)
                    {
                        for(var k = 0 ; k < listresult[j].children.length;k++)
                        {
                            if(listresult[j].children[k].uuid == rooms[i].parent)
                            {
                                var selectedFloor = rooms[i];
                                selectedFloor.children = [];
                                selectedFloor.parentname = listresult[j].children[k].name;
                                listresult[j].children[k].children.push(selectedFloor);
                            }
                        }
                    }
                }

                for(var i = 0; i < rooms.length;i++)
                {
                    for(var j = 0 ; j < listresult.length;j++)
                    {
                        for(var k = 0 ; k < listresult[j].children.length;k++)
                        {
                            for(var l = 0 ; l < listresult[j].children[k].children.length;l++)
                            {
                            if(listresult[j].children[k].children[l].uuid == rooms[i].parent)
                            {
                                var selectedRoom = rooms[i];
                                selectedRoom.children = [];
                                selectedRoom.parentname = listresult[j].children[k].children[l].name;
                                listresult[j].children[k].children[l].children.push(selectedRoom);
                            }
                            }
                        }
                    }
                }

                for(var i = 0; i < rooms.length;i++)
                {
                    for(var j = 0 ; j < listresult.length;j++)
                    {
                        for(var k = 0 ; k < listresult[j].children.length;k++)
                        {
                            for(var l = 0 ; l < listresult[j].children[k].children.length;l++)
                            {
                                for(var m = 0 ;  m < listresult[j].children[k].children[l].children.length;m++)
                                {
                                    if(listresult[j].children[k].children[l].children[m].uuid == rooms[i].parent)
                                    {
                                        var selectedCloset = rooms[i];
                                        selectedCloset.parentname = listresult[j].children[k].children[l].children[m].name;
                                        listresult[j].children[k].children[l].children[m].children.push(selectedCloset);
                                    }   
                                }
                            
                            }
                        }
                    }
                }


                
            
                return callback(listresult);

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
                    if(room[i].uuid == id)
                    {
                    responsedata.push(room[i]);
                    }
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

router.get('/room/getlocflatdata',function(req,res)
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
        disable : "",
        children: []
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
});
module.exports = router;