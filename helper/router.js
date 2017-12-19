var Q = require('q');
var Joi = require('joi');
var _ = require('lodash');
var Injector = require('draba-injector2');

module.exports = Injector.define([
    'component/app_error'
], createHelper);

function createHelper(AppError) {
    var exports = {};
    exports.prepareRequestAndResponse = function (schema, router) {
        return function (req, res) {
            var requestParams = _.extend(req.query, req.body, req.params);
            Q.resolve()
                .then(function () {
                    return Q.ninvoke(Joi, 'validate', requestParams, schema, {allowUnknown:true})
                        .catch(function (err) {
                            return Q.reject(AppError.create('PARAMS_INVALID').setMessage(err.message));
                        });
                }).then(function (params) {
                    return router(params);
                }).then(function (data) {
                    res.status(200);
                    if (Buffer.isBuffer(data)) {
                        res.send(data);
                    } else {
                        res.header('Content-Type', 'application/json');
                        res.send(JSON.stringify({
                            data:data
                        }));
                    }
                }, function (err) {
                    var appError = AppError.create('UNKNOWN').setMessage('未知错误');
                    if (AppError.hasInstance(err)) {
                        appError = err;
                    } else if (err instanceof Error) {
                        console.error(err.stack||err);
                    }
                    res.header('Content-Type', 'application/json');
                    res.status(200).send(JSON.stringify({
                        err:{
                            code:appError.getCode(),
                            message:appError.getMessage()
                        },
                        data:appError.getData()
                    }));
                });
        };
    };
    return exports;
}
