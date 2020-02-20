const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../common/config/env.config');

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

exports.getInfoMember = (req) => {
    try {
        const infoMember = { memberId: '', email: '' };
        if (!req.headers.authorization) {
            return infoMember;
        }

        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null' || typeof(token) === 'undefined') {
            return infoMember;
        }

        const payload = jwt.verify(token, config.jwt_secret);
        if (!payload) {
            return infoMember;
        }

        return { memberId: payload.sub, email: payload.email };

    } catch (error) {
        throw new Error(error);
    }
}