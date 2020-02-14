const mongoose = require('../service/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const JobSchema = new Schema({
    jobId: Number,
    jobTitle: String,
    company: Number,
    location: Number,
    postedDate: Date,
    expiredDate: Date,
    benefit: Number,
    salaryType: Number,
    salaryCurrency: String,
    salary: Number,
    createdAt: Date,
    updatedAt: Date,
    career: Number
});

module.exports = mongoose.model('job', JobSchema, 'jobs');