var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
//var TwitterStrategy     = require('passport-twitter').Strategy
var User                = require('../Schema/user');
var configFB            = require('./configFB');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: configFB.facebook_api_key,
		clientSecret: configFB.facebook_api_secret,
		callbackURL: configFB.callback_url
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		process.nextTick(function() {
		User.findOne({'facebook.id': profile.id}, function(err, user) {
			if (err)
				return done(err);
			if (user) {
				return done(null, false, user);
			} else {
				var me = new User();
				me.local.name = profile.displayName;
				me.facebook.id = profile.id;
				me.save(function(err, me) {
					if(err) 
					
					
					
					return done(err);
					done(null, me);
				});
			}
		});
		});
	}));
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
		User.findOne({ 'local.email' :  email }, function(err, user) {
			if (err)
				return done(err);
			if (user) {
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
			} else {

				var newUser            = new User();
				newUser.local.email    = email;
				newUser.local.password = newUser.generateHash(password);
				newUser.save(function(err) {
					if (err)
						throw err;
					return done(null, newUser);
				});
			}
		});    
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({ 'local.email' :  email }, function(err, user) {
			if (err)
				return done(err);
			if (!user)
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			return done(null, user);
		});
	}));
};
