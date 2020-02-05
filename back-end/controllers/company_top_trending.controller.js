const CompanyTopTrending = require('../models/company_top_trending');

exports.getCompanyTopTrending = (req, res) => {
    CompanyTopTrending.find({}).select({ 'descriptions': '1', 'image': '1', 'level': '1' }).sort({ updatedAt: 'desc' }).limit(4).exec((err, company) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ 'statusCode': 200, 'statusText': 'Success', data: company });
        }
    });
}