var LocalStrategy	= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var InstagramStrategy	= require('passport-instagram').Strategy;
var GithubStrategy	= require('passport-github').Strategy;
var SteamStrategy	= require('passport-steam').Strategy;
var GoogleStrategy	= require( 'passport-google-oauth' ).OAuth2Strategy;
var User		= require('../Schema/user');
var configFB		= require('./configFB');
var configGO		= require('./configGO');
var configIG		= require('./configIG');

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

	var GOOGLE_CLIENT_ID = configGO.api_key;
	var GOOGLE_CLIENT_SECRET = configGO.api_secret;

	passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: "http://localhost:8080/auth/google/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'google.id': profile.id }, function (err, user) {
				if (err)
					return done(err);
				if (user)
					return done(null, user);
				else {
					console.log("inscription");
					var newUser = new User();
					newUser.google.id = profile.id;
					newUser.local.name = profile.displayName;
					newUser.local.email = profile.emails[0].value;
					newUser.save(function (err, newUser) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new InstagramStrategy({
		clientID: configIG.api_key,
		clientSecret: configIG.api_secret,
		callbackURL: "http://localhost:8080/auth/instagram/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'instagram.id': profile.id }, function (err, user) {
				if (err)
					return done(err);
				if (user)
					return done(null, user);
				else {
					var newUser = new User();
					console.log(profile);
					newUser.instagram.id = profile.id;
					newUser.local.name = profile.displayName;
					newUser.save(function (err, newUser) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new GithubStrategy({
		clientID: "fe2790edfb24a2453d16",
		clientSecret: "5c78afe80e28ab984c9419132d273af7684de2e4",
		callbackURL: "http://localhost:8080/auth/github/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err)
					return done(err);
				if (user) {
					user.local.name = profile.login;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.github.id = profile.id;
					newUser.local.name = profile.login;
					newUser.save(function (err, newUser) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new SteamStrategy({
		returnURL: 'http://localhost:8080/auth/steam/callback',
		realm: 'http://localhost:8080/',
		apiKey: "E0703403C5956CCD901C82209B59C25E"
	},
	function (identifier, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'github.id': identifier }, function (err, user) {
				if (err)
					return done(err);
				if (user)
					return done(null, user);
				else {
					console.log(profile);
					var newUser = new User();
					newUser.github.id = identifier;
					newUser.save(function (err, newUser) {
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
