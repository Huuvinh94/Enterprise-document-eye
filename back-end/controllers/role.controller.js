const Role = require('../models/role');
// router.get('/employees'
exports.getAllRole = (req, res) => {
    Role.find({}, (err, role) => {
        if (err) {
            console.log(err);
        } else {
            if (role) {
                res.send({ 'statusCode': 200, 'statusText': 'Success', data: role });
            }
        }
    });
};