const Survey = require('../models/survey');
const ObjectId = require('mongodb').ObjectID;
const MailService = require('../service/MailService');
exports.getListSurvey = (req, res) => {
    Survey.aggregate([{
            $lookup: {
                from: "career",
                localField: "careerId",
                foreignField: "_id",
                as: "result"
            }
        },

    ], (err, listSurvey) => {
        if (err) {
            console.log(err);
        } else {
            if (listSurvey) {
                res.send({ 'statusCode': 200, 'statusText': 'Success', listSurvey });
            }
        }
    });
};

exports.deleteSurvey = (req, res) => {
    Survey.findOne({ '_id': ObjectId(req.body._id) }, (err, survey) => {
        if (survey) {
            Survey.deleteOne({ '_id': ObjectId(req.body._id) }, (err, done) => {
                if (!err) {
                    res.send({ 'statusCode': 200, 'statusText': ':: Delete successfully!!' });
                } else {
                    res.send({ 'statusCode': 500, 'statusText': ':: Delete error!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Survey not found!!' });
        }
    });
}

exports.saveSurvey = (req, res) => {
    const surveyData = req.body;
    surveyData.userCreate = req.email;
    surveyData.careerId = ObjectId(surveyData.careerId);
    Survey.find({ surveyName: surveyData.surveyName.trim() }, (err, surveyRes) => {
        if (err) {
            res.send({ 'statusCode': 401, 'statusText': ':: Create survey fail' });
        } else if (surveyRes.length === 0) {
            const survey = new Survey(surveyData);
            survey.save((err, surveyData) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({ 'statusCode': 200, 'statusText': ':: Create survey successfully!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 401, 'statusText': ':: Survey name already exists' });
        }
    })
}

exports.editSurvey = (req, res) => {
    const surveyData = req.body;
    surveyData.careerId = ObjectId(surveyData.careerId);
    Survey.find({
            surveyName: surveyData.surveyName.trim(),
            _id: {
                $ne: ObjectId(surveyData._id)
            }
        },
        (err, surveyRes) => {
            if (err) {
                res.send({ 'statusCode': 401, 'statusText': ':: Edit survey fail' });
            } else if (surveyRes.length === 0) {
                Survey.updateOne({ '_id': ObjectId(surveyData._id) }, surveyData, (err, done) => {
                    if (!err) {
                        res.send({ 'statusCode': 200, 'statusText': ':: Update successfully!!' });
                    } else {
                        res.send({ 'statusCode': 500, 'statusText': 'Internal Server Error' });
                    }
                });
            } else {
                res.send({ 'statusCode': 401, 'statusText': ':: Survey name already exists' });
            }
        })
}

exports.getSurveyById = (req, res) => {
    Survey.findOne({ '_id': ObjectId(req.query._id) }, (err, survey) => {
        if (survey) {
            const surveyDetail = survey
            res.send({ 'statusCode': 200, 'statusText': ':: Get successfully!!', surveyDetail });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Survey not found!!' });
        }
    });
}

exports.sendMailSurvey = (req, res) => {
    const data = req.body;
    MailService.sendMailSurvey(data._id, data.email)
        .then(function(result) {
            if (result) {
                res.send({ 'statusCode': 200, 'statusText': ':: Send survey mail successfully!!' });
            } else {
                res.send({ 'statusCode': 500, 'statusText': ':: Send survey mail fail!!' });
            }
        }).catch(function(err) {
            console.log(err);
            res.send({ 'statusCode': 500, 'statusText': ':: Send survey mail fail!!' });
        })
}