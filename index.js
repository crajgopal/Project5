const express = require('express'); // import express package

const app = new express(); //create instance of express app, init app

const path = require('path');

const session = require('express-session');
const flash = require('express-flash');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const ratingsRouter = require('./routes/ratings');
const ONE_HOUR = 1000 * 60 * 60;
const SESS_LIFETIME = ONE_HOUR;

const NODE_ENV = 'development';
const IN_PROD = NODE_ENV === 'production';
const SESS_NAME = 'sid';
const SESS_SECRET = 'secret';

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/public')));

const moragn = require('morgan'); // http request logger middleware for node.js
app.use(express.json()); //allows to handle raw json
app.use(express.urlencoded({ extended: true })); //middleware to get req body.
//app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(
  session({
    name: SESS_NAME,
    resave: false, //// to resave session varialbe if nothing is changed
    saveUninitialised: false, ////Do you save sesssion details if no value is in session ?
    secret: SESS_SECRET, ////use env variable , it encrypts the info that we store in our session
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);
app.use(flash());

//Routes
app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/ratings', ratingsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
