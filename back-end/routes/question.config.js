const QuestionController = require('../controllers/question.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function(app, upload) {
    app.get('/getAllQuestion', [
        QuestionController.getAllQuestion
    ]);

    app.get('/getQuestById', [
        QuestionController.getQuestById
    ])

    app.post('/deleteQuestion', [
        QuestionController.deleteQuestion
    ])

    app.post('/createQuestion', [
        ValidationMiddleware.validJWTNeeded,
        QuestionController.createQuestion
    ])

    app.post('/editQuest', [
        QuestionController.editQuest
    ])

    app.get('/exportQuestions', [
        QuestionController.createFileExcelQuestions
    ])

    app.post('/readFileExcel', [
        upload.single('fileUpload'),
        QuestionController.readFileExcel
    ])

    app.post('/importQuestion', [
        ValidationMiddleware.validJWTNeeded,
        QuestionController.importQuestion
    ])
};