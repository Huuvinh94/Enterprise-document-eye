const Career = require('../models/career');
const ObjectId = require('mongodb').ObjectID;
exports.getQuestCareer = (req, res) => {
    Career.aggregate([{
        $lookup: {
            from: "questions",
            localField: "_id",
            foreignField: "careerId",
            as: "questCareer"
        }
    }], (err, career) => {
        if (err) {
            console.log(err);
        } else {
            if (career) {
                res.send({ 'statusCode': 200, 'statusText': 'Success', data: career });
            }
        }
    });
};

exports.getAllCareer = (req, res) => {
    Career.find({}, (err, career) => {
        if (err) {
            console.log(err);
        } else {
            if (career) {
                res.send({ 'statusCode': 200, 'statusText': 'Success', data: career });
            }
        }
    });
};

exports.deleteCareer = (req, res) => {
    Career.findOne({ '_id': ObjectId(req.body._id) }, (err, career) => {
        if (career) {
            Career.deleteOne({ '_id': ObjectId(req.body._id) }, (err, done) => {
                if (!err) {
                    res.send({ 'statusCode': 200, 'statusText': ':: Delete successfully!!' });
                } else {
                    res.send({ 'statusCode': 500, 'statusText': ':: Delete error!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 404, 'statusText': ':: Career not found!!' });
        }
    });
}

exports.createCareer = (req, res) => {
    const careerData = req.body;
    careerData.userCreate = req.email;
    careerData.createdAt = new Date();
    careerData.updatedAt = new Date();
    delete careerData._id
    Career.find({ content: careerData.careerName.trim(), careerId: careerData.careerId }, (err, careerRes) => {
        if (err) {
            res.send({ 'statusCode': 401, 'statusText': ':: Create career fail' });
        } else if (careerRes.length === 0) {
            const career = new Career(careerData);
            career.save((err, finalRes) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({ 'statusCode': 200, 'statusText': ':: Create career successfully!!' });
                }
            });
        } else {
            res.send({ 'statusCode': 401, 'statusText': ':: Career already exists' });
        }
    })
}

exports.getCareerById = (req, res) => {
    Career.findOne({ '_id': ObjectId(req.query._id) }, (err, career) => {
        if (err) {
            console.log(err);
        } else {
            if (!career) {
                res.send({ 'statusCode': 401, 'statusText': ':: User not exist' });
            } else {
                const data = {
                    careerName: career.careerName,
                    _id: career._id
                }
                res.send({ 'statusCode': 200, 'statusText': 'Success', careerDetail: data });
            }
        }
    });
}

exports.editCareer = (req, res) => {
    Career.updateOne({ '_id': ObjectId(req.body._id) }, req.body, (err, done) => {
        if (!err) {
            res.send({ 'statusCode': 200, 'statusText': ':: Update successfully!!' });
        } else {
            res.send({ 'statusCode': 500, 'statusText': 'Internal Server Error' });
        }
    });
}