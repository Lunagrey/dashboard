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
		var name_of_page = "CodedeBatard"; // modifiable par le nom d'une page fb, pas d'un profil
		var facebook = "https://www.facebook.com/" + name_of_page;
		var yammer_feedid = "16035476";
		var twitter_quote = "hsttps://twitter.com/OfficialPCMR/status/1051682761608757248" + ";ref_src=twsrc%5Etfw";
		var aboutRouter = require('./about');
		var album = "6X2wMrmcPsXnrHqlJxXKbA";
	    var spotify_album = "https://open.spotify.com/embed/album/" + album;
	    var artist = "6sFIWsNpZYqfjUpaCgueju"
	    var spotify_artist = "https://open.spotify.com/follow/1/?uri=spotify:artist:" + artist + "&size=detail&theme=light"                                                            
		res.render('dashboard.ejs', {
			twitter_quote: twitter_quote,
			facebook: facebook,
			yammer_feedid: yammer_feedid,
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
		console.log(user.mail);
		return res.render('settings.ejs', {
			user: user
	});
    })});
    app.post('/settings', isLoggedIn, function(req, res) {
	console.log(req.session.passport.user);
	console.log("settings post");
	console.log(req.body);
	console.log(req.body.timelineFB);
	User.findById(req.session.passport.user, function (err, tank) {
		if (err) return handleError(err);
		console.log(tank);
		tank.widgets.weather.day = "3";
		tank.save(function (err, updatedTank) {
		  if (err) return handleError(err);
		  console.log(tank.mail);
		  res.redirect('/settings');
		});
	});
    });
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}