var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumberuser');
var userdb = db.sublevel('user');
var sitedb = db.sublevel('site');
var messagedb = db.sublevel('message');
var users = [
    {
        id: 1,
        username:'admin',
        password:'123',
        pages: [
        {
            id:14
        },
        {
            id:16
        },
        {
            id:18
        }
        ],
        role:"Admin"
    },
    
]

router.post('/user/createuser',function(req,res)
{
    var generateid ="";
    sequencedb.get('sequencenumberuser',function(err,no)
    {
         if (err)
         {
          if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumberuser', no, function (err, id) {
                    if (err) res.json(500, err)
                    else 
                    generateid = id + 1;
                });
            }
            else {
                res.json(500, err);
            }
         }
         else{
             generateid = no +1;
         }
        users.id = generateid;
        userdb.put('user', users, function (err) {
            if (err) res.json(500, err);
            else 
             sequencedb.put('sequencenumberuser', generateid, function (err, no) {
                            if (err) res.json(500, err)
                            else
                                res.json({ "success": true})
                        });
          
        });
    })   
})
router.post('/user/create', function (req, res) {

    var generateid ="";
    sequencedb.get('sequencenumberuser',function(err,sequence)
    {
         if (err)
         {
          if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumberuser', no, function (err, id) {
                    if (err) res.json(500, err)
                    else 
                    generateid = id + 1;
                });
            }
            else {
                res.json(500, err);
            }
         }
        else
        {
            generateid = sequence +1;
        }

        if(generateid != "")
        {
        var user = {
            id : generateid,
            username: req.body.username,
            password :req.body.password,
            role : req.body.role,
            siteid : req.body.siteid,
            pages : req.body.pages
        }  
        var listobj = [];
        userdb.get('user',function(err,obj)
        {
            if(err)
            if(err.message == "Key not found in database")
            {
               listobj.push(user);
            }
            else
            {
                res.json(500,err);
            }
            else
            var username = "";
            for(var i  = 0; i < obj.length ; i++)
            {
                if(obj[i].username == user.username )
                {
                    username = obj[i].username;
                }
            }
            if(username != "")
            {
                res.json({"success": false , "message": "Username is already taken"});
            }
            else
            {
            if(obj.length != 0)
            {
                listobj = obj;
                listobj.push(user);

            }
            else
            {
                listobj.push(user);
            }

            userdb.put('user', listobj, function (err) {
            if (err) res.json(500, err);
            else 
            sequencedb.put('sequencenumberuser', generateid, function (err, no) {
                            if (err) res.json(500, err)
                            else
                                res.json({ "success": true})
                        });
            });
            }
     });
        
    }
});
        
});

router.post('/user/register', function (req, res) 
{
    var generateid = "";
    sequencedb.get('sequencenumberuser',function(err,sequence)
    {
    if(err)
    {
        if (err.message == "Key not found in database") {
            var no = 0;
            sequencedb.put('sequencenumberuser', no, function (err, id) {
                if 
                (err) res.json(500, err)
                else 
                generateid = id + 1;
            });
            }
        else 
        {
            res.json(500, err);
        }    
    }
    else
    {
        generateid = 1;
    }
    var user = {
            id : generateid,
            username: req.body.username,
            password :req.body.password,
            role : "User",
            siteid:"",
            pages : [],
    }
    var listobj = [];
    var username = "";
    userdb.get('user',function(err,obj)
    {
        if(err)
        {
            if(err.message == "Key not found in database" )
            {
                listobj.push(user);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            for(var i  = 0; i < obj.length ; i++)
            {
                if(obj[i].username == user.username )
                {
                    username = obj[i].username;
                }
            }
            listobj = obj;
                
        }

        if(username != "")
        {
            res.json({"success": false , "message": "Username is already taken"});
        }
        else
        {
            listobj.push(user);
           
        }
        userdb.put('user', listobj, function (err) {
             if (err) res.json(500, err);
             else 
               sequencedb.put('sequencenumberuser', generateid, function (err, no) {
                            if (err) res.json(500, err)
                            else
                                res.json({ "success": true})
                        });
            }); 
        });

    });
})

router.post('/user/login',function(req,res)
{
    var user = {"username": req.body.username,"password":req.body.password};
    userdb.get('user',function(err,datauser)
    {
        var result = "";
        if(err)
            {
                if(err.message == "Key not found in database")
                    {
                        var message ="username or password not registered";
                        res.json({"success": false, "obj": message})
                    }
                    else
                        {
                            res.json(500,err);
                        }
            }
        else
        {
        for(var i = 0 ; i < datauser.length;i++)
        {
            var element = datauser[i];
            if(element.username == user.username && element.password == user.password)
            {
                result = element;
            }
        }
        if(result!= "")
        {
          
            req.session.authorized = "authorized";
            req.session.username = result.username;
            req.session.role = result.role;
            req.session.userid = result.id;
            req.session.siteid = result.siteid;
            
            var totalnotif =0;
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
                var listmessage =[];
                var date = new Date();
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
            result.totalnotif = totalnotif;
            res.json({"success": true,"obj": result});
            });
                    
        }
        else
        {
            var message ="username or password not correct";
            res.json({"success": false, "obj": message})
        }
        }
    })
});

router.post('/user/logout',function(req,res)
{
    req.session.destroy();
    res.json({result: {authorized:"unauthorized"}});

})

router.get('/user/session',function(req,res)
{
    
    if(req.session.authorized)
    {
        var result = {};
        result.authorized = req.session.authorized;
        result.username = req.session.username;
        result.role = req.session.role;
        result.userid = req.session.userid;
        result.siteid = req.session.siteid;
        res.json({"result": result})
    }
    else
    {
       res.json({result: {authorized:"unauthorized"}});
    }
})

router.get('/user/getall',function(req,res)
{
    userdb.get('user',function(err,data)
    {
        if(err)
        {
           if (err.message == "Key not found in database") {
               res.json({"success": true, "message": "no data", "obj":[]})
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
                    if (err.message != "Key not found in database") {
                    res.json(500,err);
                    }
                }
                else
                {
                    for(var i = 0 ; i < sites.length;i++)
                     {
                       for(var j = 0 ; j < data.length; j++)
                       {             
                         if(sites[i].id == data[j].siteid)
                          {
                            data[j].sitename = sites[i].sitename;                          
                          }
                          
                        }
                     }
                    res.json({"success": true,  "obj":data})
                }
            });
           
        }
    })
})

router.get('/user/:_id',function(req,res)
{
    var id = req.params._id;
    userdb.get('user',function(err,userlist)
    {
        if(err)
        {
            res.json(500,err);
        }
        else
        {
           var user ="";
           for(var i = 0; i < userlist.length;i++)
           {
               if(userlist[i].id == id)
               {
                   user = userlist[i];
               }
           }
           sitedb.get('site',function(err,sites)
           {
            if (err)
            {
                if (err.message != "Key not found in database") {
                res.json(500,err);
                }
            }
            else
            {
            for(var i = 0 ; i < sites.length;i++)
            {
                if(sites[i].id == user.siteid)
                {
                    user.sitename = sites[i].sitename;
                }
                
            }
            
            res.json({"success":true,"obj":user});
            }
        });
        }
    })
})

router.post('/user/update',function(req,res)
{
    var listobj = [];
    userdb.get('user',function(err,obj)
    {
        if(err) res.json(500,err);
        else
        for(var i =0; i <obj.length;i++ )
        {
            if(obj[i].id == req.body.id)
            {
                obj[i].username = req.body.username;
                obj[i].password = req.body.password;
                obj[i].role = req.body.role;
                obj[i].siteid = req.body.siteid;
                obj[i].pages = req.body.pages;
            }
            listobj.push(obj[i]);
        }
        userdb.put('user',listobj,function(err)
        {
            if(err)
            res.json(500,err);
            else
            res.json({"success":true,"obj":listobj})
        })
    })
})

router.post('/user/delete',function(req,res)
{
    var listobj = [];
    userdb.get('user',function(err,obj)
    {
        if(err) res.json(500,err);
        else
        for(var i =0; i <obj.length;i++ )
        {
            if(obj[i].id != req.body.id)
            {
                listobj.push(obj[i]);
            }
           
        }
        userdb.put('user',listobj,function(err)
        {
            if(err)
            res.json(500,err);
            else
            res.json({"success":true,"obj":listobj})
        })
    })
});



module.exports = router;


