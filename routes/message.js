var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumbermessage');
var messagedb = db.sublevel('message');
var sitedb = db.sublevel('site');
var locationdb = db.sublevel('locationsite');

router.post('/message/create',function(req,res)
{
    var generateid = "";
    sequencedb.get("sequencenumbermessage",function(err,no)
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
        else
        {
            generateid = no + 1;
        }

        var data = {
            "id" : generateid,
            "datetime" : req.body.datetime,
            "topic" : req.body.topic,
            "siteid" : req.body.siteid,
            "locationid": req.body.locationid
        }
        var listobj =[];
        messagedb.get('message',function(err,obj)
        {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
              listobj.push(data);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(obj.length > 0)
            {
                
               listobj = obj;
               listobj.push(data);
               
            }
            else
            {  
                if(obj != null)
                {
                 listobj[0] = obj;
                 listobj.push(data);
                }
                else
                {
                     listobj.push(data);
                }
                
            }
        }
        messagedb.put('message',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                sequencedb.put('sequencenumbermessage',generateid,function(err)
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
        })
    })
});

router.get('/message/getall',function(req,res)
{
    
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            sitedb.get('site',function(err,sites)
            {
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
                    var totalnotif =0;
                    var date = new Date()
                     for(var i = 0 ; i < sites.length;i++)
                     {
                       for(var j = 0 ; j < messages.length; j++)
                       {
                        if(sites[i].id == messages[j].siteid)
                        {
                            messages[j].sitename = sites[i].sitename;
                               
                        }      
                       }
                     }
                    for(var x = 0 ; x < messages.length; x++)
                    {
                        if(new Date(messages[x].datetime) >= new Date(date))
                        {
                            totalnotif +=1;
                        }
                    }
                    locationdb.get('locationsite',function(err,locations)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                res.json({"success":true , "obj":[]})
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                            for(var i = 0 ; i < locations.length; i++)
                            {
                            for(var j = 0 ; j < messages.length; j++)
                            {
                             if(locations[i] != null)
                              {   
                               if(locations[i].id == messages[j].locationid)
                                {
                                  messages[j].locationname = locations[i].locationname;
                                }
                                }
                             }
                            }
                            var result = {"totalnotif": totalnotif,"messages":messages}
                            res.json({"success":true,"obj":result});
                        }
                    });
                }
            });
        }
    }); 
});

router.get('/message/getbydate',function(req,res)
{
    var listmessage =[];
    var date = new Date();
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            sitedb.get('site',function(err,sites)
            {
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
                     for(var i = 0 ; i < sites.length;i++)
                     {
                       for(var j = 0 ; j < messages.length; j++)
                       {
                         if(new Date(messages[j].datetime) >= new Date(date))
                         {
                         if(sites[i].id == messages[j].siteid)
                          {
                            messages[j].sitename = sites[i].sitename;
                            listmessage.push(messages[j]);     
                          }
                         }
                        }
                     }

                     locationdb.get('locationsite',function(err,locations)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                res.json({"success":true , "obj":[]})
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                            for(var j = 0 ; j < listmessage.length; j++)
                            {
                             if(locations[i] != null)
                              {   
                               if(locations[i].id == listmessage[j].locationid)
                                {
                                  listmessage[j].locationname = locations[i].locationname;
                                }
                                }
                             }
                              res.json({"success":true,"obj":listmessage});
                        }
                    });
                }
            });
        }
    }); 
});

router.get('/message/getbysite/:_id',function(req,res)
{
    var id = req.params._id;
    var sitename = "";
    var listmessage =[];
    var date = new Date();
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
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                sitename = element.sitename;
            }

            messagedb.get('message',function(err,messages)
            {
                if(err)
                {
                    if(err.message == "Key not found in database")
                    {
                        res.json({"success":true , "obj":[]})
                    }
                    else
                    {
                        res.json(500,err);
                    }
                }
                else
                {  
                    var date = new Date();
                    var totalnotif = 0;
                    for(var i = 0 ; i < messages.length; i++)
                    {
                    if(messages[i].siteid == id)
                    {
                            messages[i].sitename = sitename; 
                            listmessage.push(messages[i]);                         
                    }
                    }
                    for(var x = 0 ; x < listmessage.length; x++)
                    {
                        if(new Date(listmessage[x].datetime) >= new Date(date))
                        {
                            totalnotif +=1;
                        }
                    }
                    locationdb.get('locationsite',function(err,locations)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                res.json({"success":true , "obj":[]})
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                               for(var i = 0 ; i < locations.length;i++)
                                {
                                    for(var j = 0 ; j < listmessage.length; j++)
                                    {
                                        if(locations[i] != null)
                                        {   
                                        if(locations[i].id == listmessage[j].locationid)
                                        {
                                            listmessage[j].locationname = locations[i].locationname;
                                        }
                                        }
                                    }
                                }
                        var result = {"totalnotif": totalnotif,"messages":listmessage}
                        res.json({"success":true,"obj":result});
                        }
                    });

                }
            });
    }
    });
});


router.get('/message/getbysitedate/:_id',function(req,res)
{
    var id = req.params._id;
    var sitename = "";
    var listmessage =[];
    var date = new Date();
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
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                sitename = element.sitename;
            }

            messagedb.get('message',function(err,messages)
            {
                if(err)
                {
                    if(err.message == "Key not found in database")
                    {
                        res.json({"success":true , "obj":[]})
                    }
                    else
                    {
                        res.json(500,err);
                    }
                }
                else
                {  for(var i = 0 ; i < messages.length; i++)
                    {
                        if(new Date(messages[i].datetime) >= new Date(date))
                        {
                            if(messages[i].siteid == id)
                            {
                            messages[i].sitename = sitename; 
                            listmessage.push(messages[i]);                         
                            }       
                        }
                    }

                    locationdb.get('locationsite',function(err,locations)
                    {
                        if(err)
                        {
                            if(err.message == "Key not found in database")
                            {
                                res.json({"success":true , "obj":[]})
                            }
                            else
                            {
                                res.json(500,err);
                            }
                        }
                        else
                        {
                               for(var i = 0 ; i < locations.length;i++)
                                {
                                    for(var j = 0 ; j < listmessage.length; j++)
                                    {
                                        if(locations[i] != null)
                                        {   
                                        if(locations[i].id == listmessage[j].locationid)
                                        {
                                            listmessage[j].locationname = locations[i].locationname;
                                        }
                                        }
                                    }
                                }
                            res.json({"success":true,"obj":listmessage});
                        }
                    });

                }
            });
        }
    });
});


router.post('/message/update/',function(req,res)
{
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id == req.body.id)
                    {
                       messages[i].datetime = req.body.datetime;
                       messages[i].topic = req.body.topic;
                       messages[i].siteid = req.body.siteid;
                       messages[i].locationid = req.body.locationid;
                    }
                }
            }
            else{
            if (messages.id == req.body.id)
             {
                    messages.datetime = req.body.datetime;
                    messages.topic = req.body.topic;
                    messages.siteid = req.body.siteid;
                    messages.locationid = req.body.locationid;
             }
            }

            messagedb.put('message',messages,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});


router.post('/message/update/',function(req,res)
{
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id == req.body.id)
                    {
                       messages[i].datetime = req.body.datetime;
                       messages[i].topic = req.body.topic;
                       messages[i].siteid = req.body.siteid;
                       messages[i].locationid = req.body.locationid;
                    }
                }
            }
            else{
            if (messages.id == req.body.id)
             {
                    messages.datetime = req.body.datetime;
                    messages.topic = req.body.topic;
                    messages.siteid = req.body.siteid;
                    messages.locationid = req.body.locationid;
             }
            }

            messagedb.put('message',messages,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});

router.post('/message/delete/',function(req,res)
{
    var listmessage = [];
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id != req.body.id)
                    {
                       listmessage.push(messages[i]);
                    }
                }
            }
            else{
            if (messages.id != req.body.id)
             {
                   listmessage.push(messages);
             }
            }

            messagedb.put('message',listmessage,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});



module.exports = router;