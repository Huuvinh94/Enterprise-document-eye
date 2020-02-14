const Location = require('../models/location');
const Transaction = require("mongoose-transactions");

exports.getAllLocation = (req, res) => {
    Location.find({}, (err, location) => {
        if (err) {
            console.log(err);
        } else {
            if (location) {
                res.send({ 'statusCode': 200, 'statusText': 'Success', data: location });
            }
        }
    });
}

exports.addLocation = async(req, res) => {
    const transaction = new Transaction();
    const listLocation = req.body;
    try {
        listLocation.forEach(item => {
            transaction.insert('location', {
                cityId: item.ID,
                cityName: item.Title,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });
        const final = await transaction.run();
        if (final.length > 0) {
            res.send({ 'statusCode': 200, 'statusText': ':: Create question successfully!!' });
        }

    } catch (error) {
        console.log(error);
        await transaction.rollback().catch(console.error);
        transaction.clean();
    }
}