const UsersRouter = require('./user.config');
const RoleRouter = require('./role.config');
const SurveysRouter = require('./survey.config');
const CareerRouter = require('./career.config');
const QuestionRouter = require('./question.config');
const AnswerSurvey = require('./answerSurvey.config');
const CityTopTrending = require('./company_top_trending.config');
const Rating = require('./rating.config');
const TemplateResume = require('./template_resume.config');
const MembersRouter = require('./member.config');

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

    TemplateResume.routesConfig(app);

    MembersRouter.routesConfig(app);
}