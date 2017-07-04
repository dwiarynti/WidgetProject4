var express = require('express');
var router = express.Router();

var db = require('./connection');
var roomdb = db.sublevel('room');
var sequencedb = db.sublevel('sequencenumberroom');



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
router.get('/room/getloc/:_id',function(req,res)
{
 var siteid = req.params._id;
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
            var listarea = [];
            var listresult = [];
            //get area
            for(var i = 0 ; i < rooms.length; i++)
            {
                if(rooms[i].disable == false)
                {
                    if(rooms[i].parent == siteid)
                    {
                    listresult.push( rooms[i]);
                    rooms[i].Building = [];
                    listarea.push(rooms[i]);
                    }
                }
            }
        if(listarea.length == 0)
        {
                res.json({"success": true , "obj": []});
        }
        else
        {
        for(var a = 0 ; a < listarea.length;a++)
        {
            for(var i = 0 ; i < listarea.length;i++)
            {
              
                if(listarea[i].parent != 0)
                {
                    if(listarea[i].parent == listarea[a].uuid)
                    {
                        listarea[i].parentname = listarea[a].name;
                    }
                }
                else
                {
                     listarea[i].parentname = "-";
                }
            }
        }
             
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
        res.json({"success": true , "obj": result});
        }
           
        }
    });
});


module.exports = router;