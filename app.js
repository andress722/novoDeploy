var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
var session = require('express-session')
const passport = require('passport')
var flash = require('express-flash');
var nodemailer = require('nodemailer')
const cors = require("cors");
var cookieParser = require('cookie-parser')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: '1212',
  resave: false,
  saveUninitialized: false
}))

app.use(flash());
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({extended:true}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Esse middleware serve para adicionar os dados do login de forma que esteja acessivel em todos os arquivo EJS
app.use(function adicionaUserNoRender(req, res, next){
  res.locals.estaLogado = req.session.estaLogado
  res.locals.usuarioLogado = req.session.usuarioLogado
  next()
})




app.use('/', require('./routes/usuario'));
app.use('/superadmin', require('./routes/superadmin'))
app.use('/pedidos', require('./routes/pedidos'))
app.use('/api', require('./routes/api'))
app.use('/pass', require('./routes/pass'))

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
