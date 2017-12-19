'use strict';
var glob = require('glob-all');
var _ = require('lodash');
var express = require('express');
var Injector = require('injector');
var pathResolver = require('./path_resolver');

function createModule() {
    return _.chain(pathResolver.includePaths)
        .reduce(function (memo, basePath) {
            var publicPaths = glob.sync('public/', {
                cwd: basePath
            });
            return _.union(memo, publicPaths);
        }, [])
        .map(function (publicPath) {
            return express.static(publicPath);
        })
        .value();
}

module.exports = Injector.define([], createModule);
