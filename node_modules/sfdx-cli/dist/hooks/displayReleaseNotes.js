"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const core_1 = require("@oclif/core");
const logError = (msg) => {
    core_1.ux.log('NOTE: This error can be ignored in CI and may be silenced in the future');
    core_1.ux.log('- Set the SFDX_HIDE_RELEASE_NOTES env var to "true" to skip this script\n');
    core_1.ux.log(msg.toString());
};
/*
 * NOTE: Please read "Notes about the hook scripts" in this PR before making changes:
 * https://github.com/salesforcecli/sfdx-cli/pull/407
 */
const hook = async () => new Promise((resolve) => {
    if (process.env.SFDX_HIDE_RELEASE_NOTES === 'true') {
        resolve();
    }
    // NOTE: This is `sfdx.cmd` here and not `run.cmd` because it gets renamed here:
    // https://github.com/salesforcecli/sfdx-cli/blob/4428505ab69aa6e21214dba96557e2ce396a82e0/src/hooks/postupdate.ts#L62
    const executable = process.platform === 'win32' ? 'sfdx.cmd' : 'run';
    const cmd = (0, child_process_1.spawn)((0, path_1.join)(__dirname, '..', '..', 'bin', executable), ['whatsnew', '--hook'], {
        stdio: ['ignore', 'inherit', 'pipe'],
        timeout: 10000,
    });
    cmd.stderr.on('data', (error) => {
        logError(error);
        resolve();
    });
    cmd.on('error', (error) => {
        logError(error);
        resolve();
    });
    // 'exit' fires whether or not the stream are finished
    cmd.on('exit', () => {
        resolve();
    });
    cmd.on('close', () => {
        resolve();
    });
});
exports.default = hook;
//# sourceMappingURL=displayReleaseNotes.js.map