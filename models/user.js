var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    realname : String,
    password: String,
    isManager : {type:Boolean ,default:false},
    workCalendar : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    }],
    dayOff : [{
        title: String,
        start: String,
        end : String,
        calendarID : String,
        message : String
    }],
    dayOffList : [String]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);