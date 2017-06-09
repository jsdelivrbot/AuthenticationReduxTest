/**
 * Created by dragos on 06/06/2017.
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const userControllerInstance = require('../src/controllers/user');
const passport = require('../src/auth');

//const userControllerInstance = new userController();

//*******FILTERS************

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
 * @param ctx
 * @returns {Promise.<boolean>}
 */
const customRequireAuthFilter = async (ctx) => {
    let accessGranted = false;
    await passport.authenticate('jwt', {session: false}, (err, user, info, status) => {
        if (user === false) {
            ctx.body = {success: false, message: "This is a protected resource"};
            ctx.status = 401;
            accessGranted = false;
        } else {
            accessGranted = true;
        }
    })(ctx, accessGranted);
    return accessGranted;
}

//*******FILTERS************


//*******USER API***********

router.get('/', async (ctx) => {
    if (await customRequireAuthFilter(ctx)) {
        //in this function, the user is authenticated, I can do whatever I need in this route
        ctx.body = {success: true, message: "Access Granted!"};
    }
});


/**
 * signup, create account route
 */
router.post('/users/signup', async (ctx) => {
    await userControllerInstance.signUp(ctx);
});

//

/**
 * sign in route. Here the requireSignin filter will verify if the password and user are correct
 */
router.post('/users/signin', requireSignin, async (ctx) => {
    await userControllerInstance.signIn(ctx);
});

/**
 * get user by id, route. This route is protected by the custom auth filter
 */
router.get('/users/:id', async (ctx) => {
    if (await customRequireAuthFilter(ctx)) {
        ctx.body = await userControllerInstance.findUserById(ctx.params.id);
    }
});

/**
 * get all the users, protected by the custom auth filter
 */
router.get('/users', async (ctx) => {
    if (await customRequireAuthFilter(ctx)) {
        await  userControllerInstance.getAllUsers(ctx);
    }
})


//*******USER API***********


module.exports = router;
