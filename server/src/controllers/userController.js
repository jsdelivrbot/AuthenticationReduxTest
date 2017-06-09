/**
 * Created by dragos on 08/06/2017.
 */

"use strict";

const jwt = require('jwt-simple');
const config = require('config');
const userModel = require('../models/userModel');


class userController {

    /**
     * This method is called from the signup route, and has the purpose of inserting a new user in the database
     * @param koaContext
     * @returns {*}
     */
    signUp(koaContext) {
        /**
         * STEP 1 - extract the email and password from the body
         */
        const {email, password} = koaContext.request.body;
        if (!email) {
            return {success: false, message: "Please specify the email"};
        }
        if (!password) {
            return {success: false, message: "Please specify the password"};
        }

        //simple email validation with regex found online
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            return  {success: false, message: "Please provide a valid email"};
        }

        /**
         * STEP 2 - execute the generator through the recursive function in order to return the result of the signup action
         */
        return signUpGeneratorControl(signUpGenerator(email, password));
    }

    signIn(koaContext) {
        if (!koaContext.req.user) {
            throw new Error('user is not authenticated!')
        }
        return {success: true, token: generateAccessToken(koaContext.req.user.dataValues)}
    }

    /**
     * A public method for getting a user by email
     * @param email
     * @returns {Promise}
     */
    getUserByEmail(email) {
        return getUserByEmailOrIdPromise(email);
    }

    /**
     * A public method which gets a user given the id
     * @param id
     * @returns {Promise}
     */
    getUserById(id) {
        return getUserByEmailOrIdPromise(null, id);
    }

    getAllUsers() {
        const allUsers = getAllUsersPromise();
        return {success: true, result: allUsers};
    }
}

/**
 ******************** PRIVATE METHODS******************
 */

/**
 * This is a recursive method which will execute the signup generator until it ends, in order to create a new user in the database
 * Inspiration for this solution found on https://vladimirponomarev.com/blog/asynchronous-code-with-promises-and-generators
 * @param signUpGen
 * @param yeildValue
 * @returns {*}
 */
function signUpGeneratorControl(signUpGen, yieldValue) {
    const next = signUpGen.next(yieldValue);
    if (!next.done) {
        return next.value.then(result => signUpGeneratorControl(signUpGen, result))
            .catch(err => signUpGen.throw(err));
    } else {
        console.log("4");
        return next.value;
    }
}

/**
 * This is the main generator function which has 3 major steps where it yields a result:
 * 1 - checks if the user exists
 * 2 - inserts the user if 1 is OK
 * 3 - generates the token if 2 is OK
 * @param email
 * @param password
 * @returns {*}
 */
function *signUpGenerator(email, password) {
    try {
        const existingUser = yield getUserByEmailOrIdPromise(email);
        if (existingUser) {
            return {success: false, message: "User already exists!"}
        }
        else {
            /**
             * call the promise which inserts the new user
             */
            const createdUser = yield addUserInDbPromise(email, password);
            if (createdUser) {
                try {
                    /**
                     * Success!!! User has been created, I have to generate the token now! I am passing the dataValues object from createdUser because there I have the id of the user
                     */
                    const generatedAccessToken = generateAccessToken(createdUser.dataValues);
                    return {success: true, token: generatedAccessToken}
                }
                catch (err) {
                    /**
                     * This catch block is "just in case something goes wrong". It might be executed if the token generation fails because the createduser variable doesn't have the dataValues object...which should never happen!
                     */
                    throw new Error(err);
                }
            }
            else {
                return {success: false, message: "User was not created"}
            }
        }
    }
    catch (err) {
        throw new Error(err);
    }
}


/**
 * This is a promise which returns the found user or null if no user is found
 * @param email
 * @returns {Promise}
 */
function getUserByEmailOrIdPromise(email, id) {
    return new Promise((resolve, reject) => {
        if (!email && !id) {
            reject("getUserByEmailOrIdPromise muust have as a parameter either the email or the id!");
        }
        try {
            userModel.findOne({where: email != null ? {email: email} : {id: id}}).then(user => {
                if (user) {
                    resolve(user);
                }
                resolve(null);

            }).catch(err => {
                reject(err);
            });
        }
        catch (err) {
            reject(err);
        }
    })
}

function getAllUsersPromise() {
    return new Promise((resolve, reject) => {
        userModel.findAll({order: ['email'], attributes: ['id', 'email']}).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * This is a promise which inserts a user in the database
 * @param email
 * @param password
 * @returns {Promise}
 */
function addUserInDbPromise(email, password) {
    return new Promise((resolve, reject) => {
        try {
            userModel.create({email, password}).then(user => {
                if (user) {
                    /**
                     * If code gets in here it means that the user has been created
                     */
                    resolve(user);
                }
                else {
                    reject("Error creating user!");
                }

            }).catch(err => {
                reject(err);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}


/**
 * helper function to generate tokens for users after they sign in
 * @param user
 * @returns {String}
 */
function generateAccessToken(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timeStamp
    }, config.auth.clientSecret);
}


/**
 * Export the default singleton of the user controller class
 */
module.exports = new userController();