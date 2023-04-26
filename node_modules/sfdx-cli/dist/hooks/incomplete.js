"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const core_1 = require("@oclif/core");
const sf_plugins_core_1 = require("@salesforce/sf-plugins-core");
const core_2 = require("@salesforce/core");
function buildChoices(matches, config) {
    const configuredIds = matches.map((p) => (0, core_1.toConfiguredId)(p.id, config));
    const maxCommandLength = configuredIds.reduce((max, id) => Math.max(max, id.length), 0);
    return matches.map((p, i) => {
        const summary = p.summary ?? p.description?.split(os.EOL)[0] ?? '';
        return {
            name: `${configuredIds[i].padEnd(maxCommandLength + 5, ' ')}${summary}`,
            value: p,
            short: configuredIds[i],
        };
    });
}
async function determineCommand(config, matches) {
    if (matches.length === 1)
        return matches[0].id;
    const prompter = new sf_plugins_core_1.Prompter();
    const choices = buildChoices(matches, config);
    const { command } = await prompter.timedPrompt([
        {
            name: 'command',
            type: 'list',
            message: 'Which of these commands do you mean',
            choices,
        },
    ]);
    return command.id;
}
const hook = async function ({ config, matches, argv }) {
    const command = await determineCommand(config, matches);
    if (argv.includes('--help') || argv.includes('-h')) {
        const Help = await (0, core_1.loadHelpClass)(config);
        const help = new Help(config, config.pjson.helpOptions);
        return help.showHelp([(0, core_1.toStandardizedId)(command, config), ...argv]);
    }
    if (matches.length === 1) {
        await core_2.Lifecycle.getInstance().emitWarning(`One command matches the partial command entered, running command:${os.EOL}${config.bin} ${(0, core_1.toConfiguredId)(command, config)} ${argv.join(' ')}`);
    }
    return config.runCommand((0, core_1.toStandardizedId)(command, config), argv);
};
exports.default = hook;
//# sourceMappingURL=incomplete.js.map