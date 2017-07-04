var express = require('express');
var router = express.Router();
var db = require('./connection');

var sequencedb = db.sublevel('sequencenumberpersonloc');
var personlocdb = db.sublevel('personloc');
var persondb = db.sublevel('person');

router.post('/personloc/cleanup',function(req,res)
{
    var data = [];
    personlocdb.put('personloc',data,function(err)
    {
        res.json({"success": true});
    })
});

router.post('/personloc/create',function(req,res)
{
    var generateid = "";
    sequencedb.get('sequencenumberpersonloc',function(err,id)
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

        var person ={
            uuid : generateid,
            uuidperson : req.body.uuidperson,
            datecreate : req.body.datecreate,
            lastseen  : req.body.lastseen,
            geolocation : req.body.geolocation,
            room: req.body.room,
            site : req.body.site,
            zone : req.body.zone
        };
       
        var listobj = [];
        personlocdb.get('personloc',function(err,dataperson)
        {
            if(err)
            {
                if(err.message == "Key not found in database")
                {
                   listobj.push(person); 
                }
                else
                {
                    res.json(500,err);
                }
            }
            else
            {
            for(var i = 0 ; i < dataperson.length;i++)
            {
                if(person.uuidperson == dataperson[i].uuidperson)
                {
                    dataperson[i].datecreate =person.datecreate ;
                    dataperson[i].lastseen = person.lastseen;
                    dataperson[i].geolocation =person.geolocation;
                    dataperson[i].room =person.room;
                    dataperson[i].site =person.site;
                    dataperson[i].zone =person.zone
                   
                }
                listobj.push(dataperson[i]);
            }
            }
            personlocdb.put('personloc',listobj,function(err)
            {
                if(err)
                res.json(500,err);
                else
                res.json({"success":true})
            });
        })
    })
});

router.get('/personloc/getall',function(req,res)
{
    personlocdb.get('personloc',function(err,datapersonloc)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
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
            persondb.get('person',function(err,dataperson)
            {
                for(var i = 0 ; i < dataperson.length;i++)
                {
                    for(var j = 0 ; j < datapersonloc.length;j++)
                    {
                        if(dataperson[i].uuid == datapersonloc[j].uuidperson)
                        {
                            datapersonloc[j].person = dataperson[i];
                        }
                    }
                }
                res.json({"success": true , "obj": datapersonloc});
            });
        }
    })
});

router.get('/personloc/get/:_id',function(req,res)
{
    var id = req.params._id;
    var selected = "";
    personlocdb.get('personloc',function(err,datapersonloc)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success": true , "obj": ""});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            persondb.get('person',function(err,dataperson)
            {
                for(var i = 0 ; i < dataperson.length;i++)
                {
                    for(var j = 0 ; j < datapersonloc.length;j++)
                    {
                        if(datapersonloc[j].uuid == id)
                        {
                        if(dataperson[i].uuid == datapersonloc[j].uuidperson)
                        {
                            datapersonloc[j].person = dataperson[i];
                        }
                            selected = datapersonloc[j];
                        }
                    }
                }
                if(selected != "")
                {
                res.json({"success": true , "obj": selected});
                }
                else
                {
                res.json({"success": true , "obj": ""});
                }
            });
        }
    })
})
module.exports = router;