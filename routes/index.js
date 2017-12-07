var express = require("express");
var router  = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("index");
});

// show register form
router.get("/register", middleware.isManager  , function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register" , middleware.isManager , function(req, res){
    var newUser = new User({username: req.body.username , realname : req.body.realname , jobtitle : req.body.jobtitle});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error" , err.message);
            return res.redirect("/register");
        }
       
        req.flash("success" , "Accout Created");
        res.redirect("calendar/dashboardhome"); 
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/calendar/dashboardhome",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Login Successful'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});


module.exports = router;