const TemplateResume = require('../models/template_resume');

exports.getListResume = (req, res) => {
    TemplateResume.find({}).select({ 'name': '1', 'descriptions': '1', 'userId': '1', 'image': '1' }).sort({ updatedAt: 'desc' }).exec((err, resume) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ 'statusCode': 200, 'statusText': 'Success', data: resume });
        }
    });
}