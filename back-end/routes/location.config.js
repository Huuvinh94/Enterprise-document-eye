const LocationController = require('../controllers/location.controller');

exports.routesConfig = function(app) {
    app.get('/getAllLocation', [
        LocationController.getAllLocation
    ])

    // app.post('/addLocation', [
    //     LocationController.addLocation
    // ])
}