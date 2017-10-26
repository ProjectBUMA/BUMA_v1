var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isManager : {type:Boolean ,default:false},
    workCalendar : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Calendar"
    }]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);