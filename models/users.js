var mongoose 			  = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
    password: String,
	name: String,
	address: String,
	phone: Number,
	dob: Date,
	usertype: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);