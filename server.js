const express = require("express");
const logger = require("morgan");
const bodyParser =  require("body-parser");
var path =  require('path');
const bcrypt = require('bcrypt');
const session =  require('express-session');
const passport = require('passport');

// authenticate user with passport
const initializePassport =  require("./passportConfig");
initializePassport(passport);

// require routes
const index = require("./routes/index");
const api =  require("./routes/api");

// initialize express
var app = express();

// log requests to the console
app.use(logger("dev"));

// parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// store user session data
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

// user passport middleware
app.use(passport.initialize);
app.use(passport.session);

// use routes
app.use('/', index);
app.use('/smarthire/api', api);

// export the app
module.exports = app;