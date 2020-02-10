const bcrypt = require('bcrypt');

exports.cryptPassword = (password, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
}

exports.comparePassword = (plainPass, hashWord, callback) => {
    bcrypt.compare(plainPass, hashWord, function(err, isPasswordMatch) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
}