const RoleController = require('../controllers/role.controller');

exports.routesConfig = function (app) {
    app.get('/getAllRole', [
        RoleController.getAllRole
    ]);

};
