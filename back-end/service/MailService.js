/**
 * MailService
 * @author Khoa.Le
 */

var nodemailer = require('nodemailer');
var config = require('../common/config/env.config');
// var Promise = require('bluebird');
// var moment = require('moment');
// var numeral = require('numeral')

var transporter = nodemailer.createTransport(config.SMTP_HOST);

module.exports = {
    /**
     * Send email for survey
     * @param  {string} name
     * @param  {string} email
     * @param  {string} message
     * @param  {string} origin
     * @return {Promise}
     */
    sendMailSurvey: function(_id, email) {
        // var url = origin || sails.config.url;
        // if (err) {
        //     console.log('Create shared sample template  error');
        //     console.log(err);
        // }
        var url = 'http://localhost:4200/do-survey/' + _id;
        var mailOptions = {
            from: config.SMTP_HOST.from,
            to: email,
            subject: 'Khảo sát cuối năm',
            html: '<div style="color:red">Xin quý khách giành chút thời gian điền bảng khảo sát sau</div></br></br><a target="_blank" href="' + url + '">Khảo sát cuối năm</a>'
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('Send Survey Mail error')
                    console.log(email)
                    console.log(error)
                    console.log(mailOptions)
                    return resolve(false)
                } else {
                    console.log('Send Survey Mail success.')
                    console.log(email)
                    return resolve(true)
                }
            });
        });
    },
}