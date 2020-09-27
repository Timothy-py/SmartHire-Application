const LocalStrategy = require("passport-local").Strategy
const bcrypt =  require("bcrypt");
var models = require('./models')


function initialize(passport) {

    const authenticateUser = async (email, password, done)=>{

        let user = await models.User.findOne({
            where: {email: email}
        })

        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if (err) {
                    throw err
                } else if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Password is not correct."})
                }
            })
        } else {
            return done(null, false, {message: "User Email not registered."})
        }
    }

    passport.use(
        new LocalStrategy(
            {
            usernameField: 'username',
            passwordField: 'password'
        },
        authenticateUser,
        console.log("User authenticated successfully")
        )
    )

    passport.serializeUser((user, done)=>{null, user.id});

    passport.deserializeUser(async (id, done)=>{
        await models.findByPk(id)
        .then((user)=>{
            console.log("User deserialized successfully")
            return done(null, user)
        })
        .catch((err)=>{
            console.log("There was an error deserializing user")
            throw err
        })
    })
}


// export the module
module.exports = initialize;