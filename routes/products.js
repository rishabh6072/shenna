var express = require("express");
var router  = express.Router();
var Product = require("../models/product");


//================
//Products Route
//================

// Find Products
router.get("/products", function(req, res){
	Product.find({}, function(err, products){
		if(err){
			console.log(err);
		} else {
			res.render("product", {products: products});
		}
	});
});

//Show addProduct form
router.get("/addproduct", isLoggedInadmin, function(req, res){
	res.render("addproduct");
});

//Product Post Route
router.post("/products", isLoggedInadmin, function(req, res){
	Product.create(req.body.product, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

//Show Route - shows more info about one Product

router.get("/products/:id", function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
        } else {
//            res.render("show", {product: foundProduct});
			res.send("product show page");
        }
    });
});

//Find Product by location.
router.post("/products-by-location", function(req, res){
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

//Edit Products Route
router.get("/products/:id/edit", isLoggedInadmin, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct){
        res.render("edit", {product: foundProduct});
    });
});

//Update Products Route
router.put("/products/:id", isLoggedInadmin, function(req, res){
   Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
       if(err){
		   	 console.log(err);
//           res.redirect("/products");
       } else {
           res.redirect("/products");
       }
   });
});

//Delete Product Route
router.delete("/products/:id", isLoggedInadmin, function(req, res){
   Product.findByIdAndRemove(req.params.id, function(err){
       if(err){
		   	 console.log(err);
       } else {
           res.redirect("/products");
       }
   });
});

//Middleware
function isLoggedInadmin(req, res, next){
	if(req.isAuthenticated() && req.user.usertype == "admin"){
		return next();
	} else {
		res.send("permission denied");
	}
}

module.exports = router;