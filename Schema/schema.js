var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Why no eggs?'],
		unique: true,
		trim: true
	},
	password: {
		type: String,
		min: [6, 'You\'re password is too short'],
		max: 12,
		unique: true
	}
});

var reasons = UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2
};    

UserSchema.statics.authenticate = function (email, password, callback) {
	User.findOne({ email: email })
	.exec(function (err, user) {
		if (err) {
			return callback(err)
		} else if (!user) {
	      	var err = new Error('User not found.');
	      	err.status = 401;
	      	return callback(err);
	   	}
	});
}

module.exports = mongoose.model('SomeModel', UserSchema );