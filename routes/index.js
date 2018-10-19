var User = require("../Schema/user");

module.exports = function(app, passport) {
	app.get('/', (req, res) => {
		res.render('./index');
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		}); 
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/dashboard',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { 
	       successRedirect : '/dashboard', 
	       failureRedirect: '/login' 
	  }),
	  function(req, res) {
	    res.redirect('/');
	});

	app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.google.com/' }));
	app.get('/auth/google/callback',
	  	passport.authenticate('google', { 
	       		successRedirect : '/dashboard', 
	       		failureRedirect: '/login'
	  	}),
	  	function(req, res) {
		res.redirect('/');
	});

	app.get('/dashboard', function(req, res) {
		var album = req.user.widgets.spotify.album;
		var spotify_album = "https://open.spotify.com/embed/album/" + album;
		var artist = req.user.widgets.spotify.artiste;
		var spotify_artist = "https://open.spotify.com/follow/1/?uri=spotify:artist:" + artist + "&size=detail&theme=light"                                                            
		res.render('dashboard.ejs', {
			user: req.user,
			spotify_album: spotify_album,
			spotify_artist: spotify_artist			    

	      });
	});
	app.get('/settings', isLoggedIn, function(req, res) {
		User.findById(req.user._id, function(err, user) {
			if (err)
			return next(err);
			return res.render('settings.ejs', {
				user: user
			});
		})});
		app.post('/settings', isLoggedIn, function(req, res) {
			User.findById(req.session.passport.user, function (err, tank) {
			if (err) return handleError(err);
			if (req.body.TTpagestatus)
				if (req.body.TTpagestatus == "Display")
				tank.widgets.twitter.display_page = true;
				else	
				tank.widgets.twitter.display_page = false;
			if (req.body.TTtweetstatus)
				if (req.body.TTtweetstatus == "Display")
				tank.widgets.twitter.display_tweet = true;
				else	
				tank.widgets.twitter.display_tweet = false;
			if (req.body.FBpagestatus)
				if (req.body.FBpagestatus == "Display")
				tank.widgets.facebook.display_page = true;
				else	
				tank.widgets.facebook.display_page = false;
			if (req.body.FBpagecomstatus)
				if (req.body.FBpagecomstatus == "Display")
				tank.widgets.facebook.display_page_com = true;
				else	
				tank.widgets.facebook.display_page_com = false;
			if (req.body.YMuserstatus)
				if (req.body.YMuserstatus == "Display")
				tank.widgets.yammer.display_user = true;
				else	
				tank.widgets.yammer.display_user = false;
			if (req.body.YMgroupstatus)
				if (req.body.YMgroupstatus == "Display")
				tank.widgets.yammer.display_group = true;
				else	
				tank.widgets.yammer.display_group = false;
			if (req.body.MTstatus)
				if (req.body.MTstatus == "Display")
				tank.widgets.weather.display = true;
				else	
				tank.widgets.weather.display = false;
			if (req.body.SPalbumstatus)
				if (req.body.SPalbumstatus == "Display")
				tank.widgets.spotify.display_album = true;
				else	
				tank.widgets.spotify.display_album = false;
			if (req.body.SPartiststatus)
				if (req.body.SPartiststatus == "Display")
				tank.widgets.spotify.display_artiste = true;
				else	
				tank.widgets.spotify.display_artiste = false;
			if (req.body.FBpage)
			tank.widgets.facebook.page = req.body.FBpage;
			if (req.body.FBpage_com)
			tank.widgets.facebook.page_com = req.body.FBpage_com;
			if (req.body.TTpage)
			tank.widgets.twitter.page = req.body.TTpage;
			if (req.body.TTtweet)
			tank.widgets.twitter.tweet = req.body.TTtweet;
			if (req.body.SPartiste)
			tank.widgets.spotify.artiste = req.body.SPartiste;
			if (req.body.SPalbum)
			tank.widgets.spotify.album = req.body.SPalbum;
			if (req.body.YMfeeduser)
			tank.widgets.yammer.userfeed = req.body.YMfeeduser;
			if (req.body.YMfeedgroup)
			tank.widgets.yammer.groupfeed = req.body.YMfeedgroup;
				tank.save(function (err, updatedTank) {
					if (err) return handleError(err);
					res.redirect('/dashboard');
				});
			});
		});
	app.get('/logout', isLoggedIn, function(req, res) {
		req.logout();
	});
	app.get('/about', function (req, res) {
		const fs = require('fs');
		let rawdata = fs.readFileSync('../about.json');
		let student = JSON.parse(rawdata);  
		res.send(student);
	});
};
	    

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}