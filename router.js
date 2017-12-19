'use strict';
var glob = require('glob-all');
var _ = require('lodash');
var normalizePath = require('normalize-path');
var Injector = require('injector');
var Router = require('express').Router;
var pathResolver = require('./path_resolver');

var routers = (function () {
    var prefixRegex = new RegExp('^controller/?');
    var suffixRegex = new RegExp('/index[.]js$|[.]js$');
    return _.reduce(pathResolver.includePaths, function (result, includePath) {
        _.chain(glob.sync(['controller/**/*.js'], {cwd: includePath, nodir: true}))
            .sort()
            .each(function (filename) {
                var moduleName = normalizePath(filename).replace(suffixRegex, '');
                result.dependencies.push(moduleName);
                result.routerPath.push(moduleName.replace(prefixRegex, '/'));
                result.length++;
            })
            .value();
        return result;
    }, {
        length: 0,
        dependencies: [],
        routerPath: []
    });
}());


function createModule() {
    var router = new Router();
    var args = arguments;
    _.times(routers.length, function (index) {
        router.use(routers.routerPath[index], args[index]);
    });
    return router;
}

module.exports = Injector.define(routers.dependencies, createModule);

