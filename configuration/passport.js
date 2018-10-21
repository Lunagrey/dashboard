var LocalStrategy	= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var GoogleStrategy	= require( 'passport-google-oauth' ).OAuth2Strategy;
var InstagramStrategy	= require('passport-instagram').Strategy;
var GithubStrategy	= require('passport-github').Strategy;
var SteamStrategy	= require('passport-steam').Strategy;
var YammerStrategy	= require('passport-yammer').Strategy;
var LinkedinStrategy	= require('passport-linkedin-oauth2').Strategy;
var DailymotionStrategy = require('passport-dailymotion').Strategy;
var DeezerStrategy	= require('passport-deezer').Strategy;
var TwitchStrategy	= require("passport-twitch").Strategy;
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
			if (user) {
				user.local.name = profile.displayName;
				return done(null, user);
			}
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
				if (user) {
					user.local.name = profile.displayName;
					user.local.email = profile.emails[0].value;
					return done(null, user);
				}
				else {
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
				if (user) {
					user.local.name = profile.username;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.instagram.id = profile.id;
					newUser.local.name = profile.username;
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
		returnURL: 'http://localhost:8080/auth/steam/return',
		realm: 'http://localhost:8080/',
		apiKey: "E0703403C5956CCD901C82209B59C25E"
	},
	function (identifier, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'steam.id': identifier }, function (err, user) {
				if (err)
				return done(err);
				if (user) {
					user.local.name = profile.personaname;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.steam.id = identifier;
					newUser.local.name = profile.personaname;
					newUser.save(function (err, newUser) {
						if (err)
						throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use(new YammerStrategy({
		clientID: "FQVsO198pdAxbGbGUMQ",
		clientSecret: "TcOYia4hqImtT5SGSAJAHAybw79Dox0Vr2EvlmH3dk",
		callbackURL: "http://localhost:8080/auth/yammer/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'yammer.id': profile.id }, function (err, user) {
				if (err)
				return done(err);
				if (user) {
					user.local.name = profile.displayName;
					user.local.email = profile.email;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.yammer.id = profile.id;
					newUser.local.name = profile.full_name;
					newUser.local.email = profile.email;
					newUser.save(function (err, newUser) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new LinkedinStrategy({
		clientID: "77bnar8pn8hpc0",
		clientSecret: "GvFtTsI9cVcDct4l",
		callbackURL: "http://localhost:8080/auth/linkedin/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'linkedin.id': profile.id }, function (err, user) {
				if (err)
					return done(err);
				if (user) {
					user.local.name = profile.formattedName;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.linkedin.id = profile.id;
					newUser.local.name = profile.formattedName;
					newUser.save(function (err, newUser) {
						if (err)
						throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use(new DailymotionStrategy({
		clientID: "297160fcd4effc48108f",
		clientSecret: "0bc52d4f1ccde794d00ba17af02499465bcdb3b8",
		callbackURL: "http://localhost:8080/auth/dailymotion/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'dailymotion.id': profile.id }, function (err, user) {
				if (err)
				return done(err);
				if (user) {
					user.local.name = profile.dispkayName;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.dailymotion.id = profile.id;
					newUser.local.name = profile.dispkayName;
					newUser.save(function (err, newUser) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new DeezerStrategy({
		clientID: "306964",
		clientSecret: "c0d85d4c8a20397efaef3c04a0741c30",
		callbackURL: "http://localhost:8080/auth/deezer/callback"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'deezer.id': profile.id }, function (err, user) {
				if (err)
					return done(err);
				if (user) {
					user.local.name = profile.displayName;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.deezer.id = profile.id;
					newUser.local.name = profile.dispkayName;
					newUser.save(function (err, newUser) {
						if (err)
						throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use(new TwitchStrategy({
		clientID: "006mj45bhlmaablrb3kp4k5nh7uscb",
		clientSecret: "f2szac4m8gziam69q3h681elf97z70",
		callbackURL: "http://localhost:8080/auth/twitch/callback",
		scope: "user_read"
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'twitch.id': profile.id }, function (err, user) {
				if (err)
				return done(err);
				if (user) {
					user.local.name = profile.display_name;
					return done(null, user);
				}
				else {
					var newUser = new User();
					newUser.twitch.id = profile.id;
					newUser.local.name = profile.display_name;
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
					newUser.local.email    = email;
					newUser.local.name    	= email;
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
