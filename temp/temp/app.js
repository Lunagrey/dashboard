var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , TwitterStrategy   =     require('passport-twitter').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , mysql             =     require('mysql')
  , app               =     express();

var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

if(config.use_database==='true')
{
  console.log("oui");
    connection.connect();
}

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/* passport.use(new TwitterStrategy({
    consumerKey: config.twitter_api_key,
    consumerSecret:config.twitter_api_secret,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
)); */
 
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

/* app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
passport.authenticate('twitter', {
    successRedirect : '/',
    failureRedirect: '/login'
  }),
  function(req, res) {
  res.redirect('/');
}); */

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
       successRedirect : '/', 
       failureRedirect: '/login' 
  }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(3000);