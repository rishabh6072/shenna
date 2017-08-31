var express = require("express");
var router  = express.Router();
var	Cart	= require("../models/cart");
var Product = require("../models/product");

//======================
//Shopping cart Routes
//======================

//Add to cart Route

router.get("/add-to-cart/:id", function(req, res){
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	Product.findById(req.params.id, function(err, product){
		if(err){
			return res.redirect("/");
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect("/products");
	});
});

// Shopping cart

router.get("/shoppingcart", function(req, res){
	if(!req.session.cart) {
		return res.render("shoppingcart",{products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render("shoppingcart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


module.exports = router;