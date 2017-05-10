'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// Define our model
var userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
    // get access to the user model
    var user = this;

    // generate a salt then run callback
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }

            // overwrite plain text password with encrypted password
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
};

// Create the model class
var ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
//# sourceMappingURL=user.js.map