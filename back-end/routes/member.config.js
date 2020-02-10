const MembersController = require('../controllers/members.controller');

exports.routesConfig = function(app) {
    app.post('/signIn', [
        MembersController.signIn
    ]);
    app.post('/signUp', [
        MembersController.signUp
    ]);
};