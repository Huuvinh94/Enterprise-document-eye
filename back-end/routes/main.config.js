const UsersRouter = require('./user.config');
const RoleRouter = require('./role.config');
const SurveysRouter = require('./survey.config');
const CareerRouter = require('./career.config');
const QuestionRouter = require('./question.config');
const AnswerSurvey = require('./answerSurvey.config');
const CityTopTrending = require('./city_top_trending.config');
const Rating = require('./rating.config');
exports.middleWaresConfig = function(app, upload) {
    // Routes config user
    UsersRouter.routesConfig(app);

    // Role config employee
    RoleRouter.routesConfig(app);

    SurveysRouter.routesConfig(app);

    CareerRouter.routesConfig(app);

    QuestionRouter.routesConfig(app, upload);

    AnswerSurvey.routesConfig(app);

    CityTopTrending.routesConfig(app);

    Rating.routesConfig(app);
}