const express = require("express");
const logger = require("morgan");
const bodyParser =  require("body-parser");
var path =  require('path');
const bcrypt = require('bcrypt');
const session =  require('express-session');
const passport = require('passport');
const initializePassport =  require("./passportConfig");


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

// authenticate user with passport
initializePassport(passport);
// user passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.set('passport', passport);

// use routes
app.use('/', index);
app.use('/smarthire/api', api);

// User Login
app.post('/login', passport.authenticate("local", {
    successMessage: "Logged in successfully",
    failureMessage: "Failed to log in"}), (req, res)=>{
        res.status(200).send({message: `Logged in successfully as user, ${req.body.email}`})
    });
// User Logout
app.get('/logout', (req, res, next)=>{
    req.logout();
    res.status(200).send({
        message: "Logged Out Successfully"
    })
})

// catch 404 and forward to error handler
app.use((req, res, next)=>{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next)=>{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // return a 404 response
    res.status(err.status || 500).send({
        message: "Page can not be found!"
    })
}) 

// export the module
module.exports = app;