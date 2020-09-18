const express = require("express");
const logger = require("morgan");
const bodyParser =  require("body-parser");

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


// export the app
module.exports = app;