var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User 	 = require("../models/users");
var Product = require("../models/product");



//============
//Index Routes
//============

//Root Route
router.get("/", function(req, res){
	Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("landing", {products: products});
		}
	});
});

//============
//Auth Routes
//============

//Show register form
router.get("/register",function(req, res) {
    res.render("register");
});

//Sign Up logic
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
    }), function(req, res) {
});


//Logout Route
router.get("/logout", function(req, res){
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

module.exports = router;