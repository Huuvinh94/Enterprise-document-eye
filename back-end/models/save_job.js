const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const saveJobSchema = new Schema({
    memberId: ObjectId,
    jobId: Number,
    createdAt: Date,
    updatedAt: Date,
});

module.exports = mongoose.model('save_job', saveJobSchema, 'save_job');