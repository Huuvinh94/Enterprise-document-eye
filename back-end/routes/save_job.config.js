const SaveJobController = require('../controllers/save_job.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function(app) {
    app.post('/saveOrUnSaveJob', [
        ValidationMiddleware.validJWTNeeded,
        SaveJobController.saveOrUnSaveJob
    ]);
};