'use strict';
module.exports = {
    access: {
        levels: {fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5},
        transports: [
            {
                type: 'console',
                options:{
                    level:'info',
                    timestamp:true,
                    json:true
                }
            }
        ]
    },
    server: {
        levels: {fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5},
        transports: [
            {
                type: 'console',
                options:{
                    level:'info'
                }
            }
        ]
    }
};