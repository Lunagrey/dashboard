var createError		= require('http-errors'),
	express         = require('express'),
	path            = require('path'),
	morgan		= require('morgan'),
	mongoose        = require('mongoose'),
	passport        = require('passport'),
	flash           = require('connect-flash'),
	cookieParser    = require('cookie-parser'),
	bodyParser      = require('body-parser'),
	session         = require('express-session'),
	config          = require('./configuration/config'),
	configDB	= require('./configuration/database.js'),
	app             = express();

mongoose.connect(configDB.url, { useNewUrlParser: true })
	.then( () => {
	    console.log('success')})
	.catch( (e) => {
	    console.error(e)
});
require('./configuration/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
		  proxy: true,
		  resave: true,
		  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/index.js')(app, passport);
//require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(8080);