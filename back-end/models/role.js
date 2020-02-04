const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    roleId: Number,
    roleName: String
});

module.exports = mongoose.model('role', roleSchema, 'roles');