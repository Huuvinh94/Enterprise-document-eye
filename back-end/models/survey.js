const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const surveySchema = new Schema({
    surveyName: String,
    userCreate: String,
    careerId: Object,
    content: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    lastLoggedIn: Date
});

module.exports = mongoose.model('survey', surveySchema, 'surveys');