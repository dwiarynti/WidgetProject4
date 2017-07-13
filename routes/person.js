var express = require('express');
var router = express.Router();

var db = require('./connection');
var persondb = db.sublevel('person');
var sitedb = db.sublevel('site');
var sequencedb = db.sublevel('sequencenumberperson');

// persondb.get('person', function (err, persons) {
//     if (err) {
//         //console.log('person', err);
//         if (err.message == "Key not found in database") {
//             persondb.put('person', person, function (err) {
//                 console.log('person data init');
//             });
//         }
//     }
// });

router.post('/person/cleanup',function(req,res)
{
    var listobj = [];
    persondb.put('person',listobj,function(err)
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

router.get('/person/getall', function (req, res) {
    persondb.get('person', function (err, person) {
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
         var listobj = [];
                for(var i = 0 ; i < person.length;i++)
                {
                    if(person[i].disable == false)
                    {
                        listobj.push(person[i])
                    }
                }
        res.json({ "success": true, "obj": listobj })
        }
    });
});

router.get('/person/:_id', function (req, res) {
    var id = req.params._id;
    persondb.get('person', function (err, person) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            var item = {};
        for (var index = 0; index < person.length; index++) {
            var element = person[index];
            if (element.id == id) {
                item = element;
            }
        }
        res.json({ "obj": item });

    });
});

router.post('/person/create', function (req, res) {

    var generateid = "";
    var listobj = [];
    sequencedb.get('sequencenumberperson',function(err,id)
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

    var person = {
        uuid : generateid,
        version: 1,
        name :req.body.personobj.name,
        nick : req.body.personobj.nick,
        email : req.body.personobj.email,
        definedbytenant : "",
        datecreated : req.body.personobj.datacreated,
        datemodified : "",
        changeby : "",
        changebyname :"",
        disable : false
    }
    var a = [];
    persondb.get('person',function(err,persons)
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
            if(persons.length > 0)
            {
                listobj = persons;
                listobj.push(person);
            }
            else
            {
                
                    listobj.push(person);
                
            }
        }

        persondb.put('person',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
               sequencedb.put('sequencenumberperson',generateid,function(err)
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

router.post('/person/update',function(req,res)
{
    persondb.get('person',function(err,persons)
    {

        if(err)
        {
            if(err.message != "Key not found in database")
            {
                res.json(500,err);
            }
        }
        else
        {
        for(var i = 0 ; i < persons.length; i++)
        {
            if(persons[i].uuid == req.body.personobj.uuid)
            {
               persons[i].name =  req.body.personobj.name,
               persons[i].nick = req.body.personobj.nick,
               persons[i].email = req.body.personobj.email;
               persons[i].datemodified = req.body.personobj.datamodified;
               persons[i].changeby = req.body.personobj.changeby;
               persons[i].changebyname = req.body.personobj.changebyname;
            }
        }
        persondb.put('person', persons , function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                res.json({"success": true});
            }
        })
        }
    });
});

router.post('/person/delete',function(req,res)
{
    persondb.get('person',function(err,persons)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json(404,err);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var listobj = [];
            for(var i = 0 ; i < persons.length;i++)
            {
                if(persons[i].uuid == req.body.personobj.uuid)
                {
                    persons[i].disable = true;
                }
            }

            persondb.put('person',persons,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                    res.json({"success": true});
                }
            })
        }
    })
})




router.get('/person/getbysite/:_id', function (req, res) {
    var id = req.params._id;
    var listitem = [];
    var sitename = {};
    sitedb.get('site', function (err, sites) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        else
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                    sitename = element.sitename;
            }
        if (sitename != "") {
            persondb.get('person', function (err, dataperson) {
                if (err)
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }

                else
                    var index = 0;
                var item = [];

                for (var x = 0; x < dataperson.length; x++) {
                    var element = dataperson[index];
                    if (element != null) {
                        if (element.siteid == id) {
                            var obj = {};

                            obj.sitename = sitename;
                            obj.id = element.id;
                            obj.siteid = element.siteid;
                            obj.name = element.name;

                            item.push(obj);
                        }
                    }
                    index += 1;
                }
                if (index == dataperson.length) {
                    res.json({ "obj": item })
                }


            });
        }
        else {
            res.json(500, err);
        }
    });


});
module.exports = router;