/**
 * Created by dragos on 08/06/2017. This file contains the authentication strategies
 */

"use strict";

const config = require('../config/default');

const userControllerInstance = require('../src/controllers/userController');

const passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

//Create local strategy for sign in with user and passsword
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    try {
        userControllerInstance.getUserByEmail(email).then(foundUser => {
            if (!foundUser) {
                return done(null, false);
            }
            else {
                //compare the passwords
                foundUser.comparePasswords(password, foundUser.password, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isMatch) {
                        return done(null, false);
                    }
                    return done(null, foundUser);
                });
            }
        }).catch(err => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }

});


//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.auth.clientSecret
};

//Create JWT Strategy
//payload -> the decoded JWT token, payload.sub is the decoded user id
//done -> Callback function called after authentication
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    try {
        userControllerInstance.getUserById(payload.sub).then(foundUser => {
            if (!foundUser) {
                return done(null, false);
            }
            return done(null, foundUser);
        }).catch(err => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

passport.use(localLogin);
passport.use(jwtLogin);


module.exports = passport;