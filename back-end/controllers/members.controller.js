const Member = require('../models/member');
const jwt = require('jsonwebtoken');
const config = require('../common/config/env.config');
const common = require('../utils/common');

exports.signIn = (req, res) => {
    const memberData = req.body;
    Member.findOne({ email: memberData.email }, (err, resMember) => {
        if (err) {
            console.log(err);
        } else {
            if (!resMember) {
                res.send({ 'statusCode': 401, 'statusText': 'Email hoặc mật khẩu không chính xác' });
            } else {
                common.comparePassword(memberData.password, resMember.password, (err, same) => {
                    if (same) {

                        const payload = { sub: resMember._id, email: resMember.email };
                        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: config.jwt_expiration_in_seconds });

                        const memberWithoutPassword = {
                            memberId: resMember._id,
                            email: resMember.email,
                            name: resMember.name
                        };

                        return res.send({ 'statusCode': 200, 'statusText': 'Đăng nhập thành công!!', info: Buffer.from(JSON.stringify({ member: memberWithoutPassword, token })).toString('base64') });

                    } else {
                        return res.send({ 'statusCode': 401, 'statusText': 'Mật khẩu không chính xác' });
                    }
                });
            }
        }
    })
}

exports.signUp = (req, res) => {
    const memberData = req.body;
    Member.find({ email: memberData.email }, (err, resMember) => {
        if (err) {
            res.send({ 'statusCode': 401, 'statusText': 'Đăng ký thất bại' });
        } else if (resMember.length === 0) {
            common.cryptPassword(memberData.password, (err, hash) => {
                if (err) {
                    res.send({ 'statusCode': 401, 'statusText': 'Đăng ký thất bại' });
                } else {
                    memberData.password = hash;
                    memberData.createdAt = new Date();
                    memberData.updatedAt = new Date();
                    const member = new Member(memberData);
                    member.save((err, member) => {
                        if (err) {
                            console.log(err);
                        } else {
                            const payload = { sub: member._id, email: member.email };
                            const token = jwt.sign(payload, config.jwt_secret);

                            const memberWithoutPassword = {
                                userId: member._id,
                                email: member.email,
                                name: member.name
                            };
                            res.send({ 'statusCode': 200, 'statusText': 'Đăng ký thành công', info: Buffer.from(JSON.stringify({ member: memberWithoutPassword, token })).toString('base64') });
                        }
                    });
                }
            });
        } else {
            res.send({ 'statusCode': 401, 'statusText': 'Địa chỉ email đã được sử dụng' });
        }
    })
}