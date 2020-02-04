const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    careerId: Number,
    content: String,
    userCreate: String,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('question', questionSchema, 'questions');