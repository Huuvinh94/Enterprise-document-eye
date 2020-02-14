const CityTopController = require('../controllers/company.controller');

exports.routesConfig = function(app) {
    app.get('/getTopCompany', [
        CityTopController.getTopCompany
    ])
}