/**
 * Created by dragos on 08/06/2017.
 */

"use strict";

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

const sequelize = require('../db');

const sequelizeInstance = sequelize.getInstance();


const User = sequelizeInstance.define('user', {
    email: {type: Sequelize.STRING, unique: true, allowNull: false},
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    description: Sequelize.STRING(100)
});

/**
 * Use the beforeValidate hook to transform the email to lowercase
 */
User.hook('beforeValidate', (user) => {
    user.email = user.email.toLowerCase();
});

/**
 * Use the beforeCreate hook to hash the password. For the latest version of sequelize these hooks must return a promise.
 */
User.hook('beforeCreate', (user) => {
    /**
     * This is the plain password. Below I'll use bcrypt to hash it inside a promise.
     */
    const rawPassword = user.password;

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                reject(err);
            }
            bcrypt.hash(rawPassword, salt, null, function (err, hash) {
                if (err) {
                    reject(err);
                }
                /**
                 * At this point the password is hashed so the hook will finish and the hashed password will be used in the then() method of the promise
                 */
                resolve(hash);
            })
        });
    }).then((hashedPassword) => {
        user.password = hashedPassword
    }).catch((err) => {
        /**
         * Couldn't hash the password, throw an error
         */
        throw new Error("Couldn't hash the password!");
    });
});


/**
 * I've added the method for comparing the passwords here because I couldn't get it to work with a sequelize instace method
 * @param rawPassword
 * @param hashedPassword
 * @param callback
 */
User.prototype.comparePasswords = (rawPassword, hashedPassword, callback) =>{
    //make sure I cast the received password to string. I had problems when the password was "1234", bcrypt.compare was throwing an error "Incorrect arguments"
    bcrypt.compare(rawPassword.toString(), hashedPassword, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
}


module.exports = User;