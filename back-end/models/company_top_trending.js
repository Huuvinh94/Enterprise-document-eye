const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const companyTopTrendingSchema = new Schema({
    companyCode: Number,
    companyName: String,
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

module.exports = mongoose.model('company_top_trending', companyTopTrendingSchema, 'company_top_trending');