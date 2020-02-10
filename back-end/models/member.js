const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const membersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('member', membersSchema, 'members');