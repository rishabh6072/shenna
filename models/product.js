var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	name: String,
    image: String,
	description: String,
	price: Number,
	isfeatured: Boolean,
	isservice: Boolean,
	serviceablearea: Array
});
module.exports = mongoose.model("Product", productSchema);