var express = require('express');
var router = express.Router();
var db = require('./connection');
var person = require('./person');
var persondb = db.sublevel('person');
var widgetdb = db.sublevel('widgetmanagement');
var sequencedb = db.sublevel('sequencenumberwidget');


router.post('/widgetmanagement/cleanup',function(req,res)
{
    var listobj = [];
    widgetdb.put('widgetmanagement',listobj,function(err)
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

router.get('/widgetmanagement/datasource',function(req,res)
{

    persondb.get('person', function (err, person) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
               
                res.json(500, err);
            }
        
        else 
         var listobj = [];
                for(var i = 0 ; i < person.length;i++)
                {
                    if(person[i].disable == false)
                    {
                        listobj.push(person[i])
                    }
                }

         var datasource = [
       {
           "sourcename": "Person",
           "field": [
               "uuid",
               "version",
               "name",
               "nick"
           ],
           "data" : listobj
       },
       {
           "sourcename": "Room",
           "field": [
               "uuid",
               "name",
               "parentname",
               "location"
           ]
       }

   ]
     res.json({"success": true, "obj": datasource});   
});
});

router.post('/widgetmanagement/create',function(req,res)
{
  
  var listobj = [];
  var generateid = "";
  sequencedb.get('sequencenumberwidget',function(err,id)
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

        var widget = {
            "euid": generateid,
            "appname": req.body.appname,
            "appstatus": req.body.appstatus,
            "widget" : req.body.widget
        }
        widgetdb.get('widgetmanagement',function(err,widgetsetting)
        {
            if(err)
            {
                    if(err.message == "Key not found in database")
                    {
                        listobj.push(widget);
                    }
                    else
                    {
                        res.json(500,err);
                    }
            }
            else
            {
                if(widgetsetting.length > 0)
                {
                    listobj = widgetsetting;
                    listobj.push(widget)
                }
                else
                {
                    listobj.push(widget);
                }

            }
            widgetdb.put('widgetmanagement',listobj,function(err)
            {
                if(err)
                res.json(500,err); 
                else
                sequencedb.put('sequencenumberwidget',generateid,function(err,id)
                {
                    if(err)
                    res.json(500,err); 
                    else
                    res.json({"success":true})
                });
               
            });


            
        });
  });
    
});

router.get('/widgetmanagement/getall',function(req,res)
{
    widgetdb.get('widgetmanagement',function(err,result)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true,"obj": []})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            res.json({"success":true,"obj": result})
        }
    })

});


router.get('/widgetmanagement/getbyid/:_id',function(req,res)
{
    var id = req.params._id;
    widgetdb.get('widgetmanagement',function(err,data)
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
        var item = "";
        for(var i = 0 ; i < data.length;i++)
        {
            if(data[i].euid == id)
            {
                item = data[i];
            }
        }
        res.json({"success ": true , "obj": item});
    }
    });
});

router.post('/widgetmanagement/update', function (req, res) {
    var listobj = [];

    widgetdb.get('widgetmanagement', function (err, obj) {
        if (err) res.json(500, err);
        else
            for (var i = 0; i < obj.length; i++) {

                if (obj[i].euid == req.body.euid) {
                    obj[i].appname = req.body.appname;
                    obj[i].appstatus = req.body.appstatus;
                    obj[i].widget = req.body.widget;
                }
                listobj.push(obj[i]);
            }

        if (listobj.length == obj.length) {
            widgetdb.put('widgetmanagement', listobj, function (err) {
                if (err)
                    res.json(500, err);
                else
                    res.json({ "success": true });
            });
        }
    });

});

var responsedata = '';
var getPerson = function(data,cb)
{
   
    persondb.get('person', function (err, person)
    {
        var result = "";
       
    if(data.field != "")
    {
        for(var i = 0 ; i < person.length;i++)
        {
            if(person[i][data.field] == data.value)
            {
                result = person[i][data.fieldname];
            }
        }
    }
    else
    {
        for(var i = 0 ; i < person.length;i++)
        {
            result = person[i][data.fieldname];
        }
    }
    
        responsedata = result;
        return cb(responsedata);
    }); 
}

var getRoom = function(data,cb)
{
   
    persondb.get('person', function (err, person)
    {
        var result = "";
       
        
        for(var i = 0 ; i < person.length;i++)
        {
            if(person[i][data.field] == data.value)
            {
                result = person[i];
            }
        }
        responsedata = result[data.field];
        return cb(responsedata);
    }); 
}

router.post('/widgetmanagement/getdata',function(req,res)
{
    var param = {
        "datasource":"",
        "fieldname":"",
        "field": "",
        "value": ""
    }

    param.datasource = req.body.conditions.datasource.sourcename;
  
    if(req.body.conditions.fieldname)
    {
        param.fieldname =req.body.conditions.fieldname;
    }
    if(req.body.conditions.conditions[0].fieldname != null)
    {
        param.field = req.body.conditions.conditions[0].fieldname;
    }
    if(req.body.conditions.conditions[0].value)
    {
        param.value =req.body.conditions.conditions[0].value;
    }
    
    if(param.datasource == "Person")
    {
    var data = getPerson(param,function(responsedata)
    {
        res.json({"success": true , "obj":responsedata});
    });
    }
    else
    {
    var data = getPerson(param,function(responsedata)
    {
        res.json({"success": true , "obj":responsedata});
    });
    }

    
})



module.exports = router;