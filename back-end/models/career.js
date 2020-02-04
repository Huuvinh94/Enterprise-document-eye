const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const careerSchema = new Schema({
    careerName: String,
    userCreate: String,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('career', careerSchema, 'career');