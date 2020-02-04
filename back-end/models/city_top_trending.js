const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const cityTopTrendingSchema = new Schema({
    cityCode: Number,
    cityName: String,
    state: String,
    userCreate: {
        type: String,
        required: true,
    },
    createdAt: Date,
    updatedAt: Date,
    descriptions: String,
    image: String,
    level: Number
});

module.exports = mongoose.model('city_top_trending', cityTopTrendingSchema, 'city_top_trending');