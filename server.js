const express = require("express");
const logger = require("morgan");
const bodyParser =  require("body-parser");
var path =  require('path');
const bcrypt = require('bcrypt');
const session =  require('cookie-session');
const passport = require('passport');
const initializePassport =  require("./passportConfig");
const ejsLayouts = require('express-ejs-layouts');
var flash = require("connect-flash");



// require routes
// const index = require("./routes/index");
// const api =  require("./routes/api");
const main = require("./routes/smarthireMain");
const { json } = require("body-parser");

// initialize express
var app = express();


// Handlebars / HBS setup and configuration
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(ejsLayouts)

// log requests to the console
app.use(logger("dev"));

// parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// trust first proxy
app.set('trust proxy', 1)



// authenticate user with passport
initializePassport(passport);
// user passport middleware


// use routes
// app.use('/', index);
app.use('/smarthire/main', main);


// store user session data
// for flash messages
var expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
app.use(passport.initialize());
app.use(passport.session());
app.set('passport', passport);

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secureProxy: true,
            maxAge: expiryDate
        }
    })
);


// User Login
app.post('/login', passport.authenticate("local", { 
    failureRedirect: '/smarthire/main'
    }), (req, res, next)=>{
        console.log(`USERNAME: ${req.user.username}`)
        console.log(`SESSION DATA: ${req.user.RoleId}`)   
        res.redirect('./smarthire/main/home')
    }
);

// app.post('/login', (req, res, next)=>{
//     passport.authenticate('local', (err, userinfo)=>{
//         if (err) {
//             return next(err);
//         }
//         if(!userinfo){
//             return res.status(409).send({message: "NO USER FOUND!"})
//         }
//         req.login(userinfo, (err)=>{
//             if(err){
//                 console.log(err)
//                 return next(err)
//             }
//             // next()
//             res.redirect('/smarthire/main/home')
//             // return next(userinfo)
//         });
//     })(req, res, next);
// })


app.get('/welcome', (req, res, next)=>{
    res.status(200).send({message: `Welcome, Mr. ${req.user.username}`})
})

// User Logout
app.get('/logout', (req, res, next)=>{
    req.logout();
    res.redirect('/smarthire/main');
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
    res.status(err.status || 500);
    var viewData = {
        parent: 'Home',
        parentUrl: '/home',
        title: 'Error',
        user: req.user,
        error: err,
        page: 'errorPage',
        layout: 'layouts/auth'
    }
    res.render('pages/error', viewData);
}) 




// export the module
module.exports = app;