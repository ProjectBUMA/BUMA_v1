var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user")

//ROUTES SETUP
var indexRoutes      = require("./routes/index")

//DATABASE SETUP
var url = process.env.DATABASEURL || "mongodb://localhost/bumadb";
mongoose.connect(url);


//SETUP APPLICATION    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "CE KMITL DEK AMERICANO",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("BUMA APP START !!");
});