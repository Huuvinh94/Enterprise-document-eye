const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    cityId: Number,
    cityName: String,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('location', locationSchema, 'location');