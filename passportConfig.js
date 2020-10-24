const LocalStrategy = require("passport-local").Strategy
const bcrypt =  require("bcrypt");
const { Strategy } = require("passport-local");
var models = require('./models')


function isValidPassword(userpass, password) {
    console.log("Comparing the passwords here...")
    return bcrypt.compareSync(password, userpass);
}


function initialize(passport) {
    console.log("Initializing passport...");
    var msgs = {};

    passport.use('local', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },

    function (req, email, password, done) {
        
        models.User.findOne({
            where: {email: email}
        })
        .then((user)=>{

            if (!user) {
                console.log("User not found!")
                // msgs.push("No User with that email address found")
                msgs.message = "No User with that email address found"
                return done(null, false, {message: "No user with that email address"})
            }

            if (!isValidPassword(user.password, password)) {
                console.log("Password is incorrect")
                // msgs.push("Password is incorrect")
                msgs.message = "Password is incorrect"
                return done(null, false, msgs);
            }

            var userinfo = user.get();
            console.log("User Info:");
            console.log(userinfo)

            // msgs.push("User Logged in successfully");
            msgs.message = "User Logged in successfully"
            return done(null, userinfo, msgs);

        }).catch((err)=>{

            console.log("Error:", err);
            return done(null, false);
        })
    }
    ))

    passport.serializeUser((user, done)=>{done(null, user.id)});

    passport.deserializeUser(async (id, done)=>{

        await models.User.findByPk(id)
        .then((user)=>{

            console.log("User deserialized successfully")
            if (user) {

                return done(null, user, msgs)
            } else {
                return done(null, false)
            }
        })
        .catch((err)=>{
            console.log("There was an error deserializing user")
            throw err
        })
    })
}
// }


// export the module
module.exports = initialize;