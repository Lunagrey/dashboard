var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./configuration/config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

var configDB = require('./config/database.js');

mongoose.connect(configDB.url, { useNewUrlParser: true })
    .then( () => {
	console.log('success')})
    .catch( (e) => {
	console.error(e)
});

require('./config/passport')(passport);
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
		  proxy: true,
		  resave: true,
      saveUninitialized: true})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(indexRouter);
app.use(usersRouter);

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
app.listen(8000);