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
	app.get('/test', function(req, res) {
		res.render('test.ejs');
	});
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
	       failureRedirect: '/dashboard' 
	  }),
	  function(req, res) {
	    res.redirect('/');
	});
	app.get('/dashboard', isLoggedIn, function(req, res) {
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
    	app.get('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.redirect('/');
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
			console.log(tank);
			if (req.body.TTstatus)
				if (req.body.TTstatus == "Display")
					tank.widgets.twitter.display = true;
				else	
					tank.widgets.twitter.display = false;
			if (req.body.FBstatus)
				if (req.body.FBstatus == "Display")
					tank.widgets.facebook.display = true;
				else	
					tank.widgets.facebook.display = false;
			if (req.body.YMstatus)
				if (req.body.YMstatus == "Display")
					tank.widgets.yammer.display = true;
				else	
					tank.widgets.yammer.display = false;
			if (req.body.MTstatus)
				if (req.body.MTstatus == "Display")
					tank.widgets.weather.display = true;
				else	
					tank.widgets.weather.display = false;
			if (req.body.SPstatus)
				if (req.body.SPstatus == "Display")
					tank.widgets.spotify.display = true;
				else	
					tank.widgets.spotify.display = false;
			if (req.body.FBpage)
				tank.widgets.facebook.page = req.body.FBpage;
			if (req.body.FBpage_com)
			tank.widgets.facebook.page_com = req.body.FBpage_com;
			if (req.body.SPartiste)
				tank.widgets.spotify.artiste = req.body.SPartiste;
			if (req.body.SPalbum)
				tank.widgets.spotify.album = req.body.SPalbum;
			if (req.body.TTpage)
				tank.widgets.twitter.page = req.body.TTpage;
			if (req.body.TTtweet)
				tank.widgets.twitter.tweet = req.body.TTtweet;
			if (req.body.SPartiste)
				tank.widgets.spotify.artiste = req.body.SPartiste;
			if (req.body.SPalbum)
				tank.widgets.spotify.album = req.body.SPalbum;
			if (req.body.YMfeed)
				tank.widgets.yammer.feed = req.body.YMfeed;
			tank.save(function (err, updatedTank) {
			  if (err) return handleError(err);
			  res.redirect('/settings');
			});
		});
	});
	app.get('/about', function(req, res) {
		res.send('');
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}