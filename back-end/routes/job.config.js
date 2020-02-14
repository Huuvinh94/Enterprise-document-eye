const JobController = require('../controllers/job.controller');

exports.routesConfig = function(app) {
    app.post('/searchJob', [
        JobController.searchJob
    ])
}