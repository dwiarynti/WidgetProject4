var express = require('express');
var router = express.Router();

var db = require('./connection');

var authmanagementdb = db.sublevel('authmanagement');
var messagedb = db.sublevel('message');
var sitedb = db.sublevel('site');
router.get('/auth/init',function(req,res)
{
    var totalnotif = 0;
    var auth = false;
    var listmessage =[];
    var date = new Date();
    messagedb.get('message',function(err,messages)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                totalnotif =0;
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            for(var i = 0 ; i < messages.length; i++)
            {
                if(new Date(messages[i].datetime) >= new Date(date))
                {     
                listmessage.push(messages[i]);                                       
                }
            }
            if(req.session.role == "User" || req.session.role == "Admin")
            {
              var countemessage = 0;
              for(var i = 0 ; i < listmessage.length; i++)
              {
              if(listmessage[i].siteid == req.session.siteid)
                {
                   countemessage+=1;                    
                }
              }
              totalnotif = countemessage;
            }
            else
            {
               totalnotif = listmessage.length;
            }
        }
        authmanagementdb.get('authmanagement',function(err,data)
        {
            if(err)
            {
                if (err.message == "Key not found in database") {
                auth = true;
                res.json({"success":true,"obj": auth,"totalnotif": totalnotif})
                }
                else {
                    res.json(500, err);
                }
            }
            else
            {
                res.json({"success":true,"obj": data,"totalnotif": totalnotif})
            }
        });

    })
});


router.post('/auth/update',function(req,res)
{
    var auth = req.body.auth;
    authmanagementdb.put('authmanagement',auth,function(err)
    {
        if(err) res.json(500,err);
        else
        res.json({"success":true})
    })
});



module.exports = router;