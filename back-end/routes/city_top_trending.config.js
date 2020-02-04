const CityTopTrendingController = require('../controllers/city_top_trending.controller');

exports.routesConfig = function(app) {
    app.get('/getCityTopTrending', [
        CityTopTrendingController.getTopCityTrending
    ])
}