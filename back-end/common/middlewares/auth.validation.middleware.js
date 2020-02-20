const jwt = require('jsonwebtoken');
const config = require('../config/env.config');

exports.validJWTNeeded = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.send({ 'statusCode': 401, 'statusText': 'Unauthorized request' });
        }

        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null' || typeof(token) === 'undefined') {
            return res.send({ 'statusCode': 401, 'statusText': 'Unauthorized request' });
        }

        const payload = jwt.verify(token, config.jwt_secret);
        if (!payload) {
            return res.send({ 'statusCode': 401, 'statusText': 'Unauthorized request' });
        }
        req.memberId = payload.sub;
        req.email = payload.email;
        next();
    } catch (error) {
        throw new Error(error);
    }
};