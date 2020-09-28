var models = require('../models')
var bcrypt = require('bcrypt');
const passport = require('passport');

// Sign up
exports.postUserCreate = async (req, res, next)=>{

    var {username, email, password} = req.body

    // first find the db if the user exist
    let user = await models.User.findOne({
        where: {
            username: username,
            email: email
        }
    })

    // if user does not exist
    if (!user) {

        let hashedPassword = await bcrypt.hash(password, 10);

        await models.User.create({
            username: username,
            email: email,
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

    } else {
        res.json({
            message: 'User already exist',
            status: false
        })
    }
};

// Login
exports.postUserLogin = (req, res, next)=>{
    console.log("Logged in successfully")
    res.status(200).send({
        message: 'Logged in successfully',
        status: true
    })

};

// Logout
exports.getUserLogout = (req, res, next)=>{
    req.logOut();
    // req.flash("success_msg", "You have logged out");
    // res.redirect("/users/login");
    res.json({
        message: 'Logged out successfully',
        status: true
    })
};

// Dashboard
exports.getDashboard = (req, res, next)=>{

    res.status(200).send({message: `Welcome ${req.user.username}, to SmartHire API`})

};