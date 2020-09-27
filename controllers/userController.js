var models = require('../models')
var bcrypt = require('bcrypt');
const passport = require('passport');

// Sign up
exports.postUserCreate = async (req, res, next)=>{
    let {username, email, password} = req.body  ;

    console.log({
        'username': username,
        'email': email,
        'password': password
    })

    let hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword)

    // res.status(200).send({message: "Signup was successful"})

    await models.User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    .then((user)=>{

        res.json({
            message: 'User registered successfully',
            data: user,
            status: true
        })
        console.log("User created successfully");
    })
    .catch((err)=>{
        console.log("There was an error creating the user: " + err);
        res.json({
            message: `There was an error creating the user: ${err}`,
            status: false
        })
    })
};

// Login
exports.postUserLogin = (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    });

    res.json({
        message: 'User Logged in succcessfully',
        status: true
    });
};