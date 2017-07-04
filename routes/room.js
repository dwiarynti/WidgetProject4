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
module.exports = router;