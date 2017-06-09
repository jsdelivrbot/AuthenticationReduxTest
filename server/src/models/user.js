/**
 * Created by dragos on 06/06/2017.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
//validation rules
const maxDescriptionRule = [100, 'Description must not exceed 100 characters!'];

//Model definition
const userSchema = mongoose.Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String,
    name: String,
    age: Number,
    description: {type: String, maxlength: maxDescriptionRule}
});

//on save hook, encrypt the password
userSchema.pre('save', function (next) {
    const user = this;

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
});

//Helper which checks if a received password is the same as the encrypted password
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    //make sure I cast the received password to string. I had problems when the password was "1234", bcrypt.compare was throwing an error "Incorrect arguments"
    bcrypt.compare(candidatePassword.toString(), this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    })
}


//create the model class
const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;