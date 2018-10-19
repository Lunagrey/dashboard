// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({ 

	local     		: {
		email 		: String,
		password 	: String,
		name		: String
	},
	facebook  		: {
		id		: String
	},
	google    		: {
		id		: String,
		token		: String,
		email		: String,
		name		: String
	},
	widgets   		: {
		weather		: {
			city    : String,
			day     : Number,
			display	: Boolean
		},
		facebook	: {
			display : Boolean,
			page    : String,
			page_com: String
		},
		twitter    	: {
			display : Boolean,
			page	: String,
			tweet	: String
		},
		yammer		: {
			display : Boolean,
			userfeed	: String,
			groupfeed	: String
		},
		spotify		: {
			artiste	: String,
			album	: String,
			display : Boolean
		}
	}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);