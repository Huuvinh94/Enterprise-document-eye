const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mainConfig = require('./routes/main.config');
const config = require('./common/config/env.config.js');
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// for parsing multipart/form-data

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, OPTIONS, POST, DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'x-requested-with, Content-Type, Accept-Encoding, Accept-Language, Cookie, Referer');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

mainConfig.middleWaresConfig(app, upload);

app.listen(config.port, function() {
    console.log('app listening at port %s', config.port);
});