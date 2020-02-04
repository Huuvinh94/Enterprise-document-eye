const UsersController = require('../controllers/user.controller');

exports.routesConfig = function(app) {
    app.post('/login', [
        UsersController.login
    ]);
    app.get('/getListUser', [
        UsersController.getListUser
    ]);
    app.post('/deleteUser', [
        UsersController.deleteUser
    ]);
    app.get('/getUserById', [
        // auth.authorize(ADMINISTRATOR),
        UsersController.getUserById
    ]);
    app.post('/editUser', [
        // ValidationMiddleware.validJWTNeeded,
        // auth.authorize(ADMINISTRATOR),
        UsersController.editUser
    ]);

    app.post('/registerUser', [
        // ValidationMiddleware.validJWTNeeded,
        // auth.authorize(ADMINISTRATOR),
        UsersController.register
    ]);
};