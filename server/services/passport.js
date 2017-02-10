/**
 * Created by dragos on 16/01/2017.
 */
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy for sign in with user and passsword
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    //verify the email and password, if everything is correct continue with done (user)
    User.findOne({email: email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }

        //now compare the passwords I have to decode teh stored password
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    })
});


//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create JWT Strategy
//payload -> the decoded JWT token
//done -> Callback function called after authentication
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    //if user is authenticated call done with the user, otherwise call done without user
    User.findById(payload.sub, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    });
});

//Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);