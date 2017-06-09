/**
 * Created by dragos on 08/06/2017.
 */

'use strict';

const router = require('koa-router')();
const userControllerInstance = require('../src/controllers/userController');
const passport = require('../src/auth');


/**
 * filter used for the signin route. It's purpose is to call the local strategy which checks if the username and password are correct. If these are
 */
const requireSignin = passport.authenticate('local', {session: false});

/**
 * this is a simple (default) token verification filter. It's not used anywhere because I wanted to have a custom filter in order to have better control on what's happening when a user is not authenticated.
 * This filter just replies with text "Unauthorized" and the code 401
 */
const requireAuthFilter = passport.authenticate('jwt', {session: false});

/**
 * This is the custom token verification filter. I wrote it because I wanted to have more control on what is happening when a user is not authenticated (it doesn't have a valid token)
 */
const customRequireAuthFilter = function *(koaContext) {
    let accessGranted = false;

    yield passport.authenticate('jwt', {session: false}, function *(err, user, info, status) {
        console.log("dupa autehtificare")
        if (user === false) {
            koaContext.body = {success: false, message: "This is a protected resource, you must be signed in to access it!"};
            koaContext.status = 401;
            accessGranted = false;
        } else {
            accessGranted = true;
        }
    });
    return accessGranted;
}


//*******USER API***********
router.get('/', function *(next) {
    this.body = {reply: "OK"};
});

/**
 * signup, create new user route
 */
router.post('/users/signup', function *(next) {
    this.body = yield userControllerInstance.signUp(this);
});

/**
 * sign in route. Here the requireSignin filter will verify if the password and user are correct
 */
router.post('/users/signin', requireSignin, function *(next) {
    this.body = yield userControllerInstance.signIn(this);
});

/**
 * get user by id, route. This route is protected by the custom auth filter
 */
router.get('/users/:id', function *(next) {
    if (yield customRequireAuthFilter(this)) {
        this.body = yield userControllerInstance.getUserById(this.params.id);
    }
});

/**
 * Same method as above, but this one uses the default auth filter which returns a simple Unauthorized text and the 401 status code if the user is not logged in
 */
router.get('/users/defaultauth/:id', requireAuthFilter, function *(next) {
    this.body = yield userControllerInstance.getUserById(this.params.id);
});

router.get('/users', function *(next) {
    if (yield customRequireAuthFilter(this)) {
        this.body = yield userControllerInstance.getAllUsers();
    }
});


//*******USER API***********


module.exports = router;