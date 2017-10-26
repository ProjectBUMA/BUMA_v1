var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");
var Calendar = require("../models/calendar");

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
     User.findById(req.params.id , function(err , user){
        if(err){
             res.redirect("back");
        }  
        else{
             res.render("calendar/settime" , {user:user});
        }
     });
});

//create new working for employee
router.post("/:id/settime",middleware.isLoggedIn ,function(req,res){
     User.findById(req.params.id , function(err , user){
          if(err){
             console.log(err);
             res.redirect("/");
          }
          else{
               console.log(req.body.calendar)
               
               Calendar.create(req.body.calendar , function(err,calendar){
                    if(err){
                         req.flash("error", "Something went wrong");
                    }
                    else{
                         calendar.start = changeDateFormat(calendar.start);
                         calendar.end = changeDateFormat(calendar.end);
                         user.workCalendar.push(calendar);
                         user.save();
                         console.log(calendar);
                         req.flash("success", "Successfully added Working Calendar");
                         res.redirect('/');
                    }
               });
          }
     });
});


function changeDateFormat(oldDate){
     
     var year = oldDate.substring(6,10);
     var month = oldDate.substring(0,2);
     var date = oldDate.substring(3,5);
     
     var indexHour = oldDate.indexOf(":");
     var hour = oldDate[indexHour-2]+oldDate[indexHour-1];
     var min = oldDate[indexHour+1]+oldDate[indexHour+2];
     
     hour = parseInt(hour);
     if(hour == 12){
          hour = "00" ;
     }
     else{
          hour += 12;
          hour = ""+hour;
     }
     return year+"-"+month+"-"+date+"T"+hour+":"+min+":"+"00";
}


module.exports = router;