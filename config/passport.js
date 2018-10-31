// const passport = require('passport');
// const Users = require('../models/Users');
// require('./strategies/local.strategies')();

// module.exports = function passportConfig(app){
//     app.use(passport.initialize());
//     app.use(passport.session());


//     //store userid in session
//     app.use(passport.serializeUser((user, done) =>{
//         done(null, user.id);
//     }))

//     app.use(passport.deserializeUser((id,done) =>{
//         Users.findById(id, (err, user)=>{
//             done(err, user);
//         })
//     }))
// }


const passport = require('passport');
const Users = require('../models/Users')
require('./strategy.local')();

module.exports = function passportConfig(app){
    app.use(passport.initialize());
    app.use(passport.session());

    //store user in session
    passport.serializeUser((user, done) =>{
        console.log("Inside serialize user!")
        done(null, user._id);
    });

    //Retrieve user from session
    passport.deserializeUser((id, done) =>{
        //find user by Id
        console.log("Inside deserialize user!")
        Users.findById(id, (err, user) =>{
        done(null, user);
        })
    });

}