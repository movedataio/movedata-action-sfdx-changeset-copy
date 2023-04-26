"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessCliFlags = void 0;
function preprocessCliFlags(process) {
    process.argv.map((arg) => {
        if (arg === '--dev-debug') {
            let debug = '*';
            const filterIndex = process.argv.indexOf('--debug-filter');
            if (filterIndex > 0) {
                debug = process.argv[filterIndex + 1];
                process.argv.splice(filterIndex, 2);
            }
            // convert --dev-debug into a set of environment variables
            process.env.DEBUG = debug;
            process.env.SFDX_DEBUG = '1';
            process.env.SFDX_ENV = 'development';
            process.env.NODE_ENV = 'development';
            // need to calculate indexOf --dev-debug here because it might've changed based on --debug-filter
            process.argv.splice(process.argv.indexOf('--dev-debug'), 1);
        }
        if (arg === '--dev-suspend') {
            process.argv.splice(process.argv.indexOf('--dev-suspend'), 1);
        }
    });
}
exports.preprocessCliFlags = preprocessCliFlags;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.preprocessCliFlags = preprocessCliFlags;
//# sourceMappingURL=flags.js.map