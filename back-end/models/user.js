const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    roleId: Number,
    password: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('user', userSchema, 'users');