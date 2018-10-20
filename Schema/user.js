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
		id		: String
	},
	instagram    		: {
		id		: String
	},
	github    		: {
		id		: String
	},
	dailymotion    		: {
		id		: String
	},
	yammer    		: {
		id		: String
	},
	linkedin    		: {
		id		: String
	},
	steam   		: {
		id		: String
	},
	widgets   		: {
		weather		: {
			display	: Boolean
		},
		facebook	: {
			display_page	: Boolean,
			display_page_com: Boolean,
			page    	: String,
			page_com	: String
		},
		twitter    	: {
			display_page	: Boolean,
			display_tweet	: Boolean,
			page		: String,
			tweet		: String
		},
		yammer		: {
			display_user	: Boolean,
			display_group	: Boolean,
			userfeed	: String,
			groupfeed	: String
		},
		spotify		: {
			display_album	: Boolean,
			display_artiste	: Boolean,
			artiste		: String,
			album		: String
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