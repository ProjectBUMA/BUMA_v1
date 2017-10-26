var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");

//INDEX - show calendar
router.get("/", middleware.isLoggedIn ,function(req, res){
     res.render("calendar/show");
});


//show all employees
router.get("/emlist",middleware.isLoggedIn ,function(req,res){
     
     User.find({}, function(err, allUser){
       if(err){
           console.log(err);
       } else {
           res.render("calendar/emlist" , {users : allUser});
       }
    });
});

//set employee work date
router.get("/:id/settime",middleware.isLoggedIn ,function(req,res){
     res.render("calendar/settime");
});



module.exports = router;