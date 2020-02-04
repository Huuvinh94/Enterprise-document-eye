const AnswerSurvey = require('../models/answerSurvey');
const ObjectId = require('mongodb').ObjectID;

exports.saveAnswerSurvey = (req, res) => {
    const answerData = req.body;
    answerData.surveyId = ObjectId(answerData.surveyId);
    const answerSurvey = new AnswerSurvey(answerData);
    answerSurvey.save((err, dataRes) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ 'statusCode': 200, 'statusText': ':: Answer survey successfully!!' });
        }
    });

}

exports.getAnswerSurveyBySurveyId = (req, res) => {
    AnswerSurvey.find({ 'surveyId': ObjectId(req.query._id) }, (err, data) => {
        if (data) {
            const listAnswer = data
            res.send({ 'statusCode': 200, 'statusText': ':: Get successfully!!', listAnswer });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Survey not found!!' });
        }
    });
}

exports.deleteAnswerSurvey = (req, res) => {
    AnswerSurvey.findOne({ '_id': ObjectId(req.body._id) }, (err, answerSurvey) => {
        if (answerSurvey) {
            AnswerSurvey.deleteOne({ '_id': ObjectId(req.body._id) }, (err, done) => {
                if (!err) {
                    res.send({ 'statusCode': 200, 'statusText': ':: Delete successfully!!' });
                } else {
                    res.send({ 'statusCode': 500, 'statusText': ':: Delete error!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Answer Survey not found!!' });
        }
    });
}