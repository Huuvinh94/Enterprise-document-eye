const SaveJob = require('../models/save_job');
const ObjectId = require('mongodb').ObjectID;
exports.saveOrUnSaveJob = (req, res) => {
    const dataSaveJob = req.body;
    if (dataSaveJob.isSave) {
        // Favourite job (insert)
        dataSaveJob.memberId = req.memberId;
        dataSaveJob.createdAt = new Date();
        dataSaveJob.updatedAt = new Date();
        const saveJob = new SaveJob(dataSaveJob);
        saveJob.save((err, saved) => {
            if (err) {
                console.log(err);
            } else {
                res.send({ 'statusCode': 200, 'statusText': 'Lưu công việc thành công' });
            }
        });
    } else {
        // Not favourite job (delete)
        SaveJob.findOne({ memberId: ObjectId(req.memberId), jobId: Number(dataSaveJob.jobId) }, (err, resJobSave) => {
            if (resJobSave) {
                SaveJob.deleteOne({ memberId: ObjectId(req.memberId), jobId: Number(dataSaveJob.jobId) }, (err, done) => {
                    if (!err) {
                        res.send({ 'statusCode': 200, 'statusText': 'Xóa công việc thành công' });
                    } else {
                        res.send({ 'statusCode': 500, 'statusText': 'Xóa vông việc lỗi' });
                    }
                });
            } else {
                res.send({ 'statusCode': 404, 'statusText': 'Không tìm thấy công việc' });
            }
        })
    }
};