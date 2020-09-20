const express = require("express");
const logger = require("morgan");
const bodyParser =  require("body-parser");

// require routes
const index = require("./routes/index");
const login =  require("./routes/login");
const main =  require("./routes/main")

// initialize express
var app = express();

// log requests to the console
app.use(logger("dev"));

// parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup a default home route
app.get("/", (req, res)=>{
    res.status(200).send({message: "Welcome to SmartHire API"})
})

// use routes
app.use('/', index);
app.use('/login', login);
app.use('/smarthire/main', main);

// export the app
module.exports = app;