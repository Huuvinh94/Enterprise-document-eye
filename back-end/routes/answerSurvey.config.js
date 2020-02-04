const AnswerSurveysController = require('../controllers/answerSurvey.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
exports.routesConfig = function(app) {
    app.post('/saveAnswerSurvey', [
        ValidationMiddleware.validJWTNeeded,
        AnswerSurveysController.saveAnswerSurvey
    ]);

    app.get('/getAnswerSurveyBySurveyId', [
        AnswerSurveysController.getAnswerSurveyBySurveyId
    ])

    app.post('/deleteAnswerSurvey', [
        AnswerSurveysController.deleteAnswerSurvey
    ])
};