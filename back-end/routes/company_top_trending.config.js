const CityTopTrendingController = require('../controllers/company_top_trending.controller');

exports.routesConfig = function(app) {
    app.get('/getCompanyTopTrending', [
        CityTopTrendingController.getCompanyTopTrending
    ])
}