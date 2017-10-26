var express = require("express");
var router  = express.Router();
var User = require("../models/user");

//INDEX - show calendar
router.get("/", function(req, res){
     res.render("calendar/show");
});


//Set Time Page
router.get("/settime",function(req,res){
     res.render("calendar/settime");
});



module.exports = router;