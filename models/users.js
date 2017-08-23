var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	name: String,
    password: String,
	city: String
});
module.exports = mongoose.model("User", productSchema);