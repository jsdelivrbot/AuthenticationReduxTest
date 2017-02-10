/**
 * Created by dragos on 14/01/2017.
 */
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//next global is like a filter which will be added to the routes which require the user to be signed in
//next is  amiddleware
const requireAuth = passport.authenticate('jwt', {session: false});

//helper for signing
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        res.send({message: 'Super secret code is ABC123'});
    });
    app.post('/signin', requireSignin, Authentication.signin)
    app.post('/signup', Authentication.signup);

}