var bodyParser    = require("body-parser"),
	express 	  = require("express"),
	mongoose 	  = require("mongoose"),
	passport	  = require("passport"),
	LocalStrategy = require("passport-local"),
	Product       = require("./models/product"),
	User 	      = require("./models/users"),
	app 		  = express(),
	multer 		  = require("multer");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
//app.use(express.static("/public"));

var url = "mongodb://localhost/shenna"
mongoose.connect(url, { useMongoClient: true });


//Passport config.
app.use(require("express-session")({
    secret: "who cares if one more light goes off, in the sky of a million stars",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware them will run for every single route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//Index Route

app.get("/", function(req, res){
	Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("landing", {products: products});
		}
	});
});

//Auth Routes

//Show register form
app.get("/register",function(req, res) {
    res.render("register");
});

//Sign Up logic

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, name: req.body.name, dob: req.body.dob, address: req.body.address, phone: req.body.phone, usertype: req.body.usertype});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
			res.redirect("/");
        });	
    });
});


// Show Login Form
app.get("/login", function(req, res) {
    res.render("login");
});


//login logic

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
    }), function(req, res) {
});


//Logout Route

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


//Middleware
function isLoggedInCustomer(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

function isLoggedInadmin(req, res, next){
	if(req.isAuthenticated() && req.user.usertype == "admin"){
		return next();
	} else {
		res.send("permission denied");
	}
}
//Products Route
app.get("/products", function(req, res){
	Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("product", {products: products});
		}
	});
});
//Find Product by location.

app.post("/products", function(req, res){
	var location = req.body.serviceablearea.toLowerCase();
	if(location){
		Product.find({serviceablearea : location}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("product", {products: products});
		}
		});	
	} else {
		Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("product", {products: products});
		}
	});
	}
});


//Show addProduct form
app.get("/addproduct", isLoggedInadmin, function(req, res){
	res.render("addproduct");
});

//Product Post Route
app.post("/products", isLoggedInadmin, function(req, res){
	Product.create(req.body.product, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

app.listen(4200, "localhost", function(){
    console.log("server started");
});