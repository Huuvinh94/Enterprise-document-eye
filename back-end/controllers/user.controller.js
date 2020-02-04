const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = require('../common/config/env.config').jwt_secret;
const ObjectId = require('mongodb').ObjectID;

exports.login = (req, res) => {
    const userData = req.body;
    User.aggregate([{
            $match: { email: userData.email }
        },
        {
            $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "roleId",
                as: "result"
            }
        },
        {
            $unwind: "$result"
        }
    ], (err, resUser) => {
        if (err) {
            console.log(err);
        } else {
            const user = resUser[0];
            if (!user) {
                res.send({ 'statusCode': 401, 'statusText': ':: Invalid Email Or Password' });
            } else {
                comparePassword(userData.password, user.password, (err, same) => {
                    if (same) {

                        const payload = { sub: user._id, roleId: user.roleId, email: user.email };
                        const token = jwt.sign(payload, secret);

                        const userWithoutPassword = {
                            userId: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            roleId: user.roleId,
                            roleName: user.result.roleName
                        };

                        res.send({ 'statusCode': 200, 'statusText': ':: Login successfully!!', info: Buffer.from(JSON.stringify({ user: userWithoutPassword, token })).toString('base64') });

                    } else {
                        res.send({ 'statusCode': 401, 'statusText': ':: Invalid Password' });
                    }
                });
            }
        }
    })
}

exports.getListUser = (req, res) => {
    User.aggregate([{
            $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "roleId",
                as: "result"
            }
        },

    ], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            const listUser = result;
            res.send({ 'statusCode': 200, 'statusText': ':: Login successfully!!', listUser: listUser });
        }
    })
}

// router.post('/delete'
exports.deleteUser = (req, res) => {
    User.findOne({ '_id': ObjectId(req.body._id) }, (err, user) => {
        if (user) {
            User.deleteOne({ '_id': ObjectId(req.body._id) }, (err, done) => {
                if (!err) {
                    res.send({ 'statusCode': 200, 'statusText': ':: Delete successfully!!' });
                } else {
                    res.send({ 'statusCode': 500, 'statusText': ':: Delete error!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: User not found!!' });
        }
    });
}

exports.getUserById = (req, res) => {
    User.aggregate([{
            $match: { _id: ObjectId(req.query._id) }
        },
        {
            $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "roleId",
                as: "result"
            }
        },
        {
            $unwind: "$result"
        }
    ], (err, resUser) => {
        if (err) {
            console.log(err);
        } else {
            if (!resUser[0]) {
                res.send({ 'statusCode': 401, 'statusText': ':: User not exist' });
            } else {
                const userDetail = {
                    _id: resUser[0]._id,
                    email: resUser[0].email,
                    firstName: resUser[0].firstName,
                    lastName: resUser[0].lastName,
                    roleId: String(resUser[0].roleId),
                    roleName: resUser[0].result.roleName
                }
                res.send({ 'statusCode': 200, 'statusText': 'Success', userDetail });
            }
        }
    });
}

exports.editUser = (req, res) => {
    if (req.body.password) {
        cryptPassword(req.body.password, (err, hash) => {
            if (err) {
                res.send({ 'statusCode': 401, 'statusText': ':: Error register' });
            } else {
                req.body.password = hash;
                User.updateOne({ '_id': ObjectId(req.body._id) }, req.body, (err, done) => {
                    if (!err) {
                        res.send({ 'statusCode': 200, 'statusText': ':: Update successfully!!' });
                    } else {
                        res.send({ 'statusCode': 500, 'statusText': 'Internal Server Error' });
                    }
                });
            }
        });
    } else {
        User.updateOne({ '_id': ObjectId(req.body._id) }, req.body, (err, done) => {
            if (!err) {
                res.send({ 'statusCode': 200, 'statusText': ':: Update successfully!!' });
            } else {
                res.send({ 'statusCode': 500, 'statusText': 'Internal Server Error' });
            }
        });
    }
}

// router.post('/register'
exports.register = (req, res) => {
    const userData = req.body;
    User.find({ email: userData.email }, (err, resUser) => {
        if (err) {
            res.send({ 'statusCode': 401, 'statusText': ':: Register fail' });
        } else if (resUser.length === 0) {
            cryptPassword(userData.password, (err, hash) => {
                if (err) {
                    res.send({ 'statusCode': 401, 'statusText': ':: Error register' });
                } else {

                    // const form = new formidable.IncomingForm();
                    // form.uploadDir = './avatars';
                    // form.keepExtensions = true;
                    // form.maxFileSize = 10 * 1024 * 1024; // 10MB
                    // form.multiples = true;

                    // form.parse(req, (err, fields, files) => {
                    //     if (err) {
                    //         res.send({ 'statusCode': 401, 'statusText': ':: Register fail' });
                    //     }

                    //     const arrayOffFiles = files[''];
                    //     if (arrayOffFiles.length > 0 ) {
                    //         const fileNames = [];
                    //         arrayOffFiles.forEach((eachFile) => {
                    //             fileNames.push(eachFile.path.split('/')[1]);
                    //         });
                    //     }
                    // });

                    userData.password = hash;
                    const user = new User(userData);
                    user.save((err, registerUser) => {
                        if (err) {
                            console.log(err);

                        } else {
                            // const payload = { subject: registerUser._id };
                            // const token = jwt.sign(payload, secret);
                            //Save info user to redis server
                            // client.incr('id', (err, id) => {
                            // });

                            res.send({ 'statusCode': 200, 'statusText': ':: Register successfully!!' });
                        }
                    });
                }
            });
        } else {
            res.send({ 'statusCode': 401, 'statusText': ':: Email already exists' });
        }
    })
}

function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return callback(err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
            return callback(err, hash);
        });
    });
}
// exports.logout = (req, res) => {
//     const actionTimeEnd = getCurrentDate();
//     const reqData = req.body;
//     client.incr('id', (err, id) => {
//         if (err) {
//             return res.send({ 'statusCode': 401, 'statusText': ':: Server error' });
//         }

//         client.hmset('logInfo', [
//             id, `{ "userId": "${req.userId}", "actionPage": "${reqData.actionPage}", "actionTimeStart": "${reqData.actionTimeStart}", "actionTimeEnd": "${actionTimeEnd}" }`
//         ], (err, reply) => {
//             if (err) {
//                 return res.send({ 'statusCode': 401, 'statusText': ':: Server error' });
//             } else {
//                 res.send({ 'statusCode': 200, 'statusText': ':: Logout successfully!!' });
//             }
//         });
//     });
// }

function comparePassword(plainPass, hashWord, callback) {
    bcrypt.compare(plainPass, hashWord, function(err, isPasswordMatch) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
}