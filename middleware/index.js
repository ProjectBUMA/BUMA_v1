var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var Calendar = require("../models/calendar");

// all the middleare goes here
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}


middlewareObj.isManager = function(req, res, next){
    if(req.isAuthenticated()){
       if(req.user.isManager == true){
           return next()
       }
    }
    req.flash("error", "Please Login As Manager");
    res.render("error/page_403");
}


module.exports = middlewareObj;