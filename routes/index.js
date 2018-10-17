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
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { 
	       successRedirect : '/dashboard', 
	       failureRedirect: '/dashboard' 
	  }),
	  function(req, res) {
	    res.redirect('/');
	});
	app.get('/dashboard', function(req, res) {
		console.log("error here");
		var day = 0; // de 0 à 3 seulement
		var meteo = "https://www.prevision-meteo.ch/uploads/widget/paris_" + day + ".png";
		var name_of_page = "CodedeBatard"; // modifiable par le nom d'une page fb, pas d'un profil
		var facebook = "https://www.facebook.com/" + name_of_page;
		var yammer_feedid = "16035476";
		var twitter_quote = "https://twitter.com/OfficialPCMR/status/1051682761608757248" + ";ref_src=twsrc%5Etfw";
		var aboutRouter = require('./about');                                                                
		console.log(req.user);
		console.log(req.user.local.email);
		res.render('dashboard.ejs', {
			twitter_quote: twitter_quote,
			facebook: facebook,
			yammer_feedid: yammer_feedid,
			meteo: meteo,
		    	user: req.user
	      });
	});
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}
