const JobController = require('../controllers/job.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function(app) {
    app.post('/searchJob', [
        // ValidationMiddleware.validJWTNeeded,
        JobController.searchJob
    ])
}