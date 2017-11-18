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
     if(userCalender.length >= 1){
          userCalender.forEach(function(calendar){
               Calendar.findById(calendar , function(err, thisCalendar) {
                    if(err){
                         console.log(err)
                    }
                    showCalendar.push(thisCalendar);
                    i++;
                    if(i == userCalender.length){
                         res.render("calendar/show" , {showCalendar:showCalendar});
                    }
               })
          })
     }
     else{
          res.send("no work")
     }
    
});

//employee day off
router.get("/dayoff",middleware.isLoggedIn ,function(req,res){
     var user = req.user
     var userCalender = req.user.workCalendar;
     var showCalendar = [];
     var i = 0;
     
     if(userCalender.length >= 1){
          userCalender.forEach(function(calendar){
               Calendar.findById(calendar , function(err, thisCalendar) {
                    if(err){
                         console.log(err)
                    }
                    showCalendar.push(thisCalendar);
                    i++;
                    if(i == userCalender.length){
                         res.render("calendar/setdayoff" , {user:user,showCalendar:showCalendar});
                    }
               })
          })
     }
     else{
          res.send("no work")
     }
});

//manager dayoff view
router.get("/managerdayoff",middleware.isLoggedIn ,function(req,res){
     
     User.find({}, function(err, allUser){
         if(err){
             console.log(err);
          } else {
             //console.log(allUser)
             res.render("calendar/managerdayoff" , {users : allUser});
          }
     });
     
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
               
               if(userCalender.length >= 1){
                    userCalender.forEach(function(calendar){
                         Calendar.findById(calendar , function(err, thisCalendar) {
                              if(err){ 
                                   console.log(err)
                              }
                              showCalendar.push(thisCalendar);
                              i++;
                              if(i == userCalender.length){
                                   res.render("calendar/show" , {user:user,showCalendar:showCalendar});
                              }
                         })
                    })
               }
               else{
                    res.send("no work")
               }
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

//promt message input
router.get("/message/:id/:workid" ,middleware.isLoggedIn, function(req,res){
     
     User.findById(req.params.id,function(err, user) {
         if(err){
              console.log(err);
             res.redirect("/");
         }
         else{
              Calendar.findById(req.params.workid,function(err, dayOff) {
                  if(err){
                         req.flash("error", "Something went wrong");
                  }
                  else{
                         res.render("calendar/addmessage" , {user:user , dayOff:dayOff})  
                           
                  }
              })
         }
     })
     
     
})



//create new day off
router.post("/setdayoff/:id/:workid" ,middleware.isLoggedIn, function(req,res){
     
     User.findById(req.params.id,function(err, user) {
         if(err){
              console.log(err);
             res.redirect("/");
         }
         else{
              Calendar.findById(req.params.workid,function(err, dayOff) {
                  if(err){
                         req.flash("error", "Something went wrong");
                  }
                  else{
                           var nDayOff = {}
                           nDayOff.message = req.body.message
                           nDayOff.title = dayOff.title
                           nDayOff.start = dayOff.start
                           nDayOff.end = dayOff.end
                           nDayOff.calendarID = dayOff._id
                           user.dayOffList.push(dayOff._id)
                           user.dayOff.push(nDayOff)
                           user.save()
                         //  console.log(user.dayOff)
                           req.flash("success", "Successfully Send DayOff Request");
                           res.redirect('/calendar/dayoff');
                           
                  }
              })
         }
     })
})

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
                         res.redirect('/calendar/'+req.params.id+'/workingcalendar');
                    }
               });
          }
     });
});


//Reject DayOff
router.delete("/dayoffreject/:id/:dayoffid" , function(req,res){
    User.findById(req.params.id , function(err, user) {
          if(err){
               res.send(err)
          }
          else{
               var index = user.dayOffList.indexOf(req.params.dayoffid);
               
               for(var i = 0; i < user.dayOff.length; i++) {
                   var obj = user.dayOff[i];
               
                    if(user.dayOffList[index] == obj.calendarID){
                       
                       if (index > -1) {
                              req.flash("success", "Successfully Reject DayOff Request");  
                              user.dayOff.splice(i,1);
                              user.dayOffList.splice(index, 1);
                              user.save()
                       }
                    }
               }

               res.redirect("back")
          }
     })

});


//Approve DayOff
router.delete("/dayoffapprove/:id/:dayoffid" , function(req,res){
     
    User.findById(req.params.id , function(err, user) {
          if(err){
               res.send(err)
          }
          else{
               var index = user.dayOffList.indexOf(req.params.dayoffid);
               var workindex = user.workCalendar.indexOf(req.params.dayoffid);
               
               for(var i = 0; i < user.dayOff.length; i++) {
                    
                    var obj = user.dayOff[i];
               
                    if(user.dayOffList[index] == obj.calendarID){
                       
                         if (index > -1 && workindex > -1) {
                              req.flash("success", "Successfully Approve DayOff Request");  
                              user.workCalendar.splice(workindex, 1)
                              user.dayOff.splice(i,1);
                              user.dayOffList.splice(index, 1);
                              user.save()
                         }
                    }
               }
               res.redirect("back");
          }
     })
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