const TemplateResumeController = require('../controllers/template_resume.controller');

exports.routesConfig = function(app) {
    app.get('/getListResume', [
        TemplateResumeController.getListResume
    ])
}