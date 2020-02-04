const CareerController = require('../controllers/career.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
exports.routesConfig = function(app) {
    app.get('/getQuestCareer', [
        CareerController.getQuestCareer
    ]);

    app.get('/getAllCareer', [
        CareerController.getAllCareer
    ])

    app.get('/getCareerById', [
        CareerController.getCareerById
    ])

    app.post('/deleteCareer', [
        CareerController.deleteCareer
    ])

    app.post('/createCareer', [
        ValidationMiddleware.validJWTNeeded,
        CareerController.createCareer
    ])

    app.post('/editCareer', [
        CareerController.editCareer
    ])
};