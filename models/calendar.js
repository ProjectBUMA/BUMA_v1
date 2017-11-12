var mongoose = require("mongoose");

var CalendarSchema = new mongoose.Schema({
    title: String,
    start: String,
    end : String,
});


module.exports = mongoose.model("Calendar", CalendarSchema);
