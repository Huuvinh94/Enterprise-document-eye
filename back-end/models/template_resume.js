const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const templateResume = new Schema({
    name: String,
    descriptions: String,
    userId: Object,
    image: String,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('template_resume', templateResume, 'template_resume');