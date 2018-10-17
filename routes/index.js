var aboutRouter= require('./dashboard');

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
	app.get('/auth/facebook', passport.authenticate('facebook-signup', {
		successRedirect : '/dashboard',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	app.get('/auth/facebook/callback',
	passport.authenticate('facebook-signup', { 
			 successRedirect : '/dashboard', 
			 failureRedirect: '/login',
			 failureFlash : true
		}),
		function(req, res) {
			res.redirect('/');
	});
	app.get('/dashboard', function(req, res) {
		var day = 0; // de 0 à 3 seulement
		var meteo = "https://www.prevision-meteo.ch/uploads/widget/paris_" + day + ".png";
		var name_of_page = "CodedeBatard"; // modifiable par le nom d'une page fb, pas d'un profil
		var facebook = "https://www.facebook.com/" + name_of_page;
		var yammer_feedid = "16035476";
	    var twitter_quote = "https://twitter.com/OfficialPCMR/status/1051682761608757248" + ";ref_src=twsrc%5Etfw"
	    var spotify_album = "6X2wMrmcPsXnrHqlJxXKbA";
	    var spotify = "https://open.spotify.com/embed/album/" + spotify_album;
		var drinks = [
			{ name: 'Bloody Mary', drunkness: 3 },
			{ name: 'Martini', drunkness: 5 },
			{ name: 'Scotch', drunkness: 10 }
	      	];
	      	var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
	    	var aboutRouter = require('./about');                                                                
		res.render('dashboard.ejs', {
			twitter_quote: twitter_quote,
			facebook: facebook,
			yammer_feedid: yammer_feedid,
			meteo: meteo,
		    	drinks: drinks,
		    tagline: tagline,
		    spotify: spotify,
		    	user: req.user
	      });
	});
    app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
    });
    app.get('/settings', function(req, res) {
        res.render('settings.ejs');
    });
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
