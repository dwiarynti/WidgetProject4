var express = require('express');
var router = express.Router();

var db = require('./connection');
var collection = db.get('Html_Collection');


router.get('/html/init/', function(req,res)
{
    collection.find({}, function(err,data)
    {
        if(err)
        res.json(500,err);
        else
        res.json({"obj": data});
    })
});

router.post('/html/create',function(req,res)
{
    collection.insert({
        formname : "Profile",
        element : req.body.element
    },function(err)
    {
        if(err)
        {
            res.json(500,err);
        }
        else
        {
           res.json({success : true});
        }
    })
})
module.exports = router;