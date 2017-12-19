'use strict';

var express = require('express');
var path = require('path');
var _ = require('lodash');
//var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLogger = require('express-winston');
var Injector = require('injector');

module.exports = Injector.define([
    'router',
    'static',
    'component/logger'
], createApp);
function createApp (router,
                    staticMiddleware,
                    logger) {
    var app = express();

    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    _.each(staticMiddleware, function (middleware) {
        app.use(middleware);
    });

    app.use(expressLogger.logger({
        winstonInstance:logger.access,
        meta:true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(router);

    app.use(function (req, res, next) {
        res.status(404);
        next();
    });

    app.use(function (err, req, res, next) {
        res.status(500);
        next();
    });
    return app;
}
