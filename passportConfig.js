const LocalStrategy = require("passport-local").Strategy
const bcrypt =  require("bcrypt");
const { Strategy } = require("passport-local");
var models = require('./models')


// function initialize(passport) {

//     const authenticateUser = async (req, email, password, done)=>{

//         await models.User.findOne({
//             where: {email: email}
//         })
//         .then((user)=>{

//             if (user) {
//                 bcrypt.compare(password, user.password, (err, isMatch)=>{
//                     if (err) {
//                         throw err
//                     } 
                    
//                     if(isMatch) {
//                         return done(null, user.get());
//                     } else {
//                         return done(null, false, {message: "Password is not correct."})
//                     }
//                 })
//             } else {
//                 return done(null, false, {message: "No User with that email address."})
//             }

//         })
//         .catch((err)=>{
//             console.log(`ERROR: ${err}`);
//             return done(null, false);
//         })
//     }

//     passport.use(
//         new LocalStrategy(
//             {
//             usernameField: 'email',
//             passwordField: 'password',
//             passReqToCallback: true
//         },
//         authenticateUser
//         )
//     )

function isValidPassword(userpass, password) {
    console.log("Comparing the passwords here...")
    return bcrypt.compareSync(password, userpass);
}

function initialize(passport) {
    console.log("Initializing passport...");
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
                return done(null, false, {message: "No user with that email address"})
            }
            if (!isValidPassword(user.password, password)) {
                console.log("Password is incorrect")
                return done(null, false, {message: "Password is incorrect"});
            }
            var userinfo = user.get();
            console.log(`User Info: ${userinfo}`);
            return done(null, userinfo);
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
                return done(null, user)
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