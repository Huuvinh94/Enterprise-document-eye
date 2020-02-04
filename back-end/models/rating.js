const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const rating = new Schema({
    userId: Object,
    contents: String,
    createdAt: Date,
    rating: String,
});

module.exports = mongoose.model('rating', rating, 'rating');