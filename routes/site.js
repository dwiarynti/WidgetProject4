var express = require('express');
var router = express.Router();

var db = require('./connection');

var sitedb = db.sublevel('site');
var sequencedb = db.sublevel('sequencenumbersite');
var site = [
    {
        id: "001",
        sitename: "A"
    },
    {
        id: "002",
        sitename: "B"
    },
    {
        id: "003",
        sitename: "C"
    }
]

sitedb.get('site', function (err, sites) {
    if (err) {
        //console.log('site', err);
        if (err.message == "Key not found in database") {
            sitedb.put('site', site, function (err) {
                console.log('site data init');
            });
        }
    }
});


// router.post('/site/Create/', function (req, res) {
//     sitedb.put('site', site, function (err) {
//         if (err) res.json(500, err);
//         else res.json({ success: true });
//     });
// });

router.get('/site/getall', function (req, res) {

    sitedb.get('site', function (err, sites) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
        var result = [];
        if(sites.length > 0)
        {
            result = sites;
        }
        else
        {
            result.push(sites);
        }
        res.json({ "obj": result });
    })
});


router.post('/site/create',function(req,res)
{
    var generateid = "";
    sequencedb.get("sequencenumbersite",function(err,no)
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
            id : generateid,
            sitename: req.body.sitename
        }

        var listobj =[];
        sitedb.get('site',function(err,obj)
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
        sitedb.put('site',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                sequencedb.put('sequencenumbersite',generateid,function(err)
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
        });

        });
    });
});

router.get('/site/:_id',function(req,res)
{
    var id = req.params._id;
    sitedb.get('site',function(err,obj)
    {
        if(err)
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
            var selected = {};
            for(var i = 0 ; i < obj.length;i++)
            {
                if(obj[i].id == id)
                {
                    selected = obj[i];
                }
            }
            res.json({"success":true,"obj": selected});
        }
    })
})

router.post('/site/update/',function(req,res)
{
    sitedb.get('site',function(err,sites)
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
            if(sites.length > 0)
            {
                for(var i = 0 ; i < sites.length;i++)
                {
                    if(sites[i].id == req.body.id)
                    {
                       sites[i].sitename= req.body.sitename;
                    }
                }
            }
            else{
            if (sites.id == req.body.id)
             {
                 sites.sitename= req.body.sitename;
             }
            }

            sitedb.put('site',sites,function(err)
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

router.post('/site/delete/',function(req,res)
{
    var listsite = [];
    sitedb.get('message',function(err,sites)
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
            if(sites.length > 0)
            {
                for(var i = 0 ; i < sites.length;i++)
                {
                    if(sites[i].id != req.body.id)
                    {
                       listsite.push(sites[i]);
                    }
                }
            }
            else{
            if (sites.id != req.body.id)
             {
                   listsite.push(sites);
             }
            }

            sitedb.put('site',listsite,function(err)
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


