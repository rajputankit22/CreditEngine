var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
var fs = require('fs');
var mongoose = require('mongoose');
var moment = require('moment');
var schedule  = require('node-schedule');

/* Database */
var db = "mongodb://localhost/pdf";

mongoose.connect(db);
var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Database collection
var details = mongoose.model('details');

//For delete expire bankStatement pdf's.
// Run Daily 12:00 AM.
var analysis = schedule.scheduleJob('0 0 * * *', function(next){
  details.find({expire_timestamp:{$lt: Date(moment())}},function(err,pdf_details){
    pdf_details.forEach(function(fileName){
      fs.unlink('public/uploads/'+fileName.pdf_name,function(err){
        if (err) {
          console.log(err);
        }
        console.log('done');
      });
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// app.use(logger('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger({
  format: ':date[clf] :method :url :status :response-time ms' }
));
app.use(bodyParser({limit: '50mb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
