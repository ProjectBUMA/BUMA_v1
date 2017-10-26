var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");
var Calendar = require("../models/calendar");

//INDEX - show calendar
router.get("/", middleware.isLoggedIn ,function(req, res){
     var userCalender = req.user.workCalendar;
     var showCalendar = [];
     var i = 0;
     
     userCalender.forEach(function(calendar){
          Calendar.findById(calendar , function(err, thisCalendar) {
               if(err){
                    console.log(err)
               }
               var newObject = {};
               newObject.title = thisCalendar.title;
               newObject.start = thisCalendar.start;
               newObject.end = thisCalendar.end;
               
               showCalendar.push(newObject);
               i++;
               if(i == userCalender.length){
                    res.render("calendar/show" , {showCalendar:showCalendar});
               }
          })
     })
    
});

router.get("/:id/workingcalendar", middleware.isLoggedIn ,function(req, res){
     
     User.findById(req.params.id , function(err , user){
        if(err){
             console.log(err);
        }  
        else{
               var userCalender = user.workCalendar;
               var showCalendar = [];
               var i = 0;
     
               userCalender.forEach(function(calendar){
                    Calendar.findById(calendar , function(err, thisCalendar) {
                         if(err){
                              console.log(err)
                         }
                         var newObject = {};
                         newObject.title = thisCalendar.title;
                         newObject.start = thisCalendar.start;
                         newObject.end = thisCalendar.end;
                         
                         showCalendar.push(newObject);
                         i++;
                         if(i == userCalender.length){
                              res.render("calendar/show" , {showCalendar:showCalendar});
                    }
                    })
               })
         } 
     });

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

//show all employees for calendar
router.get("/emcalendar",middleware.isLoggedIn ,function(req,res){
     
     User.find({}, function(err, allUser){
       if(err){
           console.log(err);
       } else {
           res.render("calendar/emcalendar" , {users : allUser});
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
               var calendar = req.body.calendar
               calendar.start = changeDateFormat(calendar.start);
               calendar.end = changeDateFormat(calendar.end);
               
               Calendar.create(req.body.calendar , function(err,newCalendar){
                    if(err){
                         req.flash("error", "Something went wrong");
                    }
                    else{
                         user.workCalendar.push(newCalendar);
                         user.save();
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
     
     if(oldDate.indexOf("P")!=-1){
          hour = parseInt(hour);
          if(hour == 12){
               hour = "12" ;
          }
          else{
               hour += 12;
               hour = ""+hour;
          }
     }
     if(oldDate.indexOf("A")!=-1){
          hour = parseInt(hour);
          if(hour==12){
               hour="00"
          }
          else if(hour<10){
          hour="0"+hour
          }
          
     }
     
     return year+"-"+month+"-"+date+"T"+hour+":"+min+":"+"00";
}


module.exports = router;