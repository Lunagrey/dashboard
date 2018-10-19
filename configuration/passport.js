var LocalStrategy	= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var GoogleStrategy	= require( 'passport-google-oauth' ).OAuth2Strategy;
var User		= require('../Schema/user');
var configFB		= require('./configFB');
var configGO		= require('./configGO');

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
		process.nextTick(function() {
		User.findOne({'facebook.id': profile.id}, function(err, user) {
			if (err)
				return done(err);
			if (user)
				return done(null, user);
			else {
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

	passport.use(new GoogleStrategy({
		clientID: "547694208308-1chcgb2ki7h3d35m8h2cquqj6p4gelgl.apps.googleusercontent.com",
		clientSecret: "PKiwsUv3Vw2hMIbHxrWbLvSp",
		callbackURL: "http://localhost:8080/auth/google/callback"
	},
	function (token, refreshToken, profile, done) {
	process.nextTick(function () {
		User.findOne({ 'google.id': profile.id }, function (err, user) {
			if (err)
				return done(err);
			if (user) {
				return done(null, user);
			} else {
				var newUser = new User();
				newUser.google.id = profile.id;
				newUser.local.name = profile.displayName;
				newUser.local.email = profile.emails[0].value; // pull the first email
				newUser.save(function (err) {
					if (err)
						throw err;
					return done(null, newUser);
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
				newUser.local.email    			= email;
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
