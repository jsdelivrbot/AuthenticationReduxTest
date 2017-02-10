/**
 * Created by dragos on 14/01/2017.
 */
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timeStamp
    }, config.secret);

}

exports.signin = function (req, res, next) {
    //at this time the user is signed in with the correct email and password I have to return the token
    //passport adds the user in req.user
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({error: "You must provide email and password"});
    }

    //See if a user with a given email exists
    User.findOne({email: email}, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        //If a user with email does exist return error
        if (existingUser) {
            return res.status(422).send({error: 'Email is in use'});
        }

        //If user with email doesn't exist create th enew user
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (err) {
            if (err) {
                return next(err);
            }
        });

        //Respond to request
        res.json({token: tokenForUser(user)});
    });


}
