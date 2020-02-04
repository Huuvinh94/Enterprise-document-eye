const CityTopTrending = require('../models/city_top_trending');

exports.getTopCityTrending = (req, res) => {
    CityTopTrending.find({}).select({ 'descriptions': '1', 'image': '1', 'level': '1' }).sort({ updatedAt: 'desc' }).limit(4).exec((err, city) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ 'statusCode': 200, 'statusText': 'Success', data: city });
        }
    });
}