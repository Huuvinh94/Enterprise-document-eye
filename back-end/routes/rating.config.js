const RatingController = require('../controllers/rating.controller');

exports.routesConfig = function(app) {
    app.get('/getRating', [
        RatingController.getRating
    ]);
};