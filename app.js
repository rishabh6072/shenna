var bodyParser   = require("body-parser"),
	express 	 = require("express"),
	mongoose 	 = require("mongoose"),
	Product      = require("./models/product"),
	User 	     = require("./models/users"),
	app 		 = express(),
	multer 		 = require("multer");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
//app.use(express.static("/public"));

var url = "mongodb://localhost/shenna"
mongoose.connect(url, { useMongoClient: true });

app.get("/products", function(req, res){
	Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("product", {products: products});
		}
	});
});

app.post("/products", function(req, res){
	Product.create(req.body.product, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

app.get("/addproduct", function(req, res){
	res.render("addproduct");
});


app.get("/users", function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		} else {
			res.render("user", {users: users});
		}
	});
});

app.post("/users", function(req, res){
	User.create(req.body.user, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/users")
		}
	});
});

app.get("/adduser", function(req, res){
	res.render("adduser");
});

app.listen(4200, "localhost", function(){
    console.log("server started");
});