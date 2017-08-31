var bodyParser    = require("body-parser"),
	express 	  = require("express"),
	mongoose 	  = require("mongoose"),
	passport	  = require("passport"),
	LocalStrategy = require("passport-local"),
	Product       = require("./models/product"),
	User 	      = require("./models/users"),
	Cart		  = require("./models/cart"),
	methodOverride= require("method-override"),
	app 		  = express(),
	session 	  =	require("express-session"),
	MongoStore 	  = require("connect-mongo")(session),
	multer 		  = require("multer");

var productRoutes = require("./routes/products"),
	cartRoutes 	  = require("./routes/cart"),
	indexRoutes	  = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
//app.use(express.static("/public"));
app.use(methodOverride("_method"));

var url = "mongodb://localhost/shenna"
mongoose.connect(url, { useMongoClient: true });


//Passport config.
app.use(require("express-session")({
    secret: "who cares if one more light goes off, in the sky of a million stars",
    resave: false,
    saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {maxAge: 180 * 60 * 1000}, //180min
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware them will run for every single route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.session = req.session;
	next();
});

app.use(indexRoutes);
app.use(productRoutes);
app.use(cartRoutes);

app.listen(4200, "localhost", function(){
    console.log("server started");
});