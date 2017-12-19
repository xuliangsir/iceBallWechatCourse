'use strict';
var path = require('path');
var normalizePath = require('normalize-path');
var glob = require('glob-all');
var _ = require('lodash');

var pkg = require('./package.json');

module.exports.projectPath = normalizePath(__dirname);

module.exports.includePaths = _.chain(glob.sync(pkg.includePaths, {cwd:__dirname}))
    .map(function (filename) {
        return normalizePath(path.resolve(__dirname, filename));
    }).value();
