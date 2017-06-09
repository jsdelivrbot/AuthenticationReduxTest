/**
 * Created by dragos on 06/06/2017.
 */
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('config');

//helper function to generate tokens for users after they sign in
function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({
        sub: user._id,
        iat: timeStamp
    }, config.auth.clientSecret);
}

class userController {

    /**
     * This does the signup, it checks if the email is unique and if it is returns the authentication token
     * @param ctx
     * @returns {Promise.<void>}
     */
    async signUp(ctx) {
        const {email, password} = ctx.request.body;
        if (!email) {
            throw new Error('Email is not present!');
        }
        if (!password) {
            throw new Error('Password is not present!');
        }
        //at this point I can start saving the user

        //step 1: see if another user with same email exists
        let existingUser;
        try {
            existingUser = await User.findOne({email: email});
        }
        catch (err) {
            throw new Error(err);
        }
        if (!existingUser) {
            //step 2, create the new user
            try {
                const newUser = new User({email, password});
                const createdUser = await newUser.save();
                ctx.status = 201;
                ctx.body = {success: true, token: tokenForUser(createdUser)};
            }
            catch (err) {
                throw new Error(err);
            }
        }
        else {
            //user with the same email exists, return info to client side
            ctx.status = 422;
            ctx.body = {message: 'Email is in use', success: false}
        }
    }

    /**
     * this is executed from the sign in route. We get to this point only when the login is valid
     * @param ctx
     * @returns {Promise.<void>}
     */
    async signIn(ctx) {
        if (!ctx.state || !ctx.state.user) {
            throw new Error('User is not authenticated!')
        }
        ctx.body = {success: true, token: tokenForUser(ctx.state.user)}
    }

    /**
     * This method searches for a user by email
     * @param email
     * @returns {Promise.<*>}
     */
    async finUserByEmail(email) {
        let userToReturn;
        try {
            userToReturn = await User.findOne({email: email});
        }
        catch (err) {
            throw new Error(err);
        }
        return userToReturn;
    }

    /**
     * This method returns a user if it is found
     * @param id
     * @returns {Promise.<*>}
     */
    async findUserById(id) {
        let userToReturn;
        try {
            userToReturn = await User.findById(id);
        }
        catch (err) {
            throw new Error(err);
        }
        if (!userToReturn) {
            return {success: false, result: null};
        }
        else {
            return {success: true, result: userToReturn};
        }
    }

    /**
     * This returns all the users
     * @param ctx
     * @returns {Promise.<{success: boolean, result: null}>}
     */
    async getAllUsers(ctx) {
        try {
            let allUsers = await User.find().sort('email');
            if (!allUsers) {
                return {success: true, result: null};
            }
            ctx.body = {success: true, result: allUsers};
        }
        catch (err) {
            throw new Error(err);
        }
    }

}
/**
 *Export the default singleton of the user controller
 */
module.exports =  new userController();