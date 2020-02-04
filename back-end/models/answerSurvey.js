const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const answerSurveySchema = new Schema({
    surveyId: Object,
    content: String,
    dateDone: Date,
});

module.exports = mongoose.model('answerSurvey', answerSurveySchema, 'answerSurveys');