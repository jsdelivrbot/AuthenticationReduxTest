/**
 * Created by dragos on 06/06/2017.
 */
const config = require('config');

const userControllerInstance = require('../src/controllers/user');

const passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

//Create local strategy for sign in with user and passsword
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    //verify the email and password, if everything is correct continue with done (user)
    const foundUser = await userControllerInstance.finUserByEmail(email);
    if (!foundUser) {
        return done(null, false);
    }
    else {
        //compare the passwords
        foundUser.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, foundUser);
        });
    }
});


//Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.auth.clientSecret
};

//Create JWT Strategy
//payload -> the decoded JWT token
//done -> Callback function called after authentication
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    //if user is authenticated call done with the user, otherwise call done without user
    const foundUser = await userControllerInstance.findUserById(payload.sub);
    if (!foundUser) {
        return done(null, false);
    }
    else {
        done(null, foundUser.result);
    }


});

passport.use(localLogin);
passport.use(jwtLogin);


module.exports = passport;