const SurveysController = require('../controllers/survey.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
exports.routesConfig = function(app) {

    app.get('/getListSurvey', [
        SurveysController.getListSurvey
    ]);

    app.post('/deleteSurvey', [
        SurveysController.deleteSurvey
    ]);

    app.post('/saveSurvey', [
        ValidationMiddleware.validJWTNeeded,
        SurveysController.saveSurvey
    ]);

    app.post('/editSurvey', [
        ValidationMiddleware.validJWTNeeded,
        SurveysController.editSurvey
    ]);

    app.post('/sendMailSurvey', [
        ValidationMiddleware.validJWTNeeded,
        SurveysController.sendMailSurvey
    ]);

    app.get('/getSurveyById', [
        SurveysController.getSurveyById
    ])

};