"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@oclif/core");
const chalk = require("chalk");
const sfdxCommandHelp_1 = require("./sfdxCommandHelp");
class SfdxHelp extends core_1.Help {
    constructor() {
        super(...arguments);
        this.CommandHelpClass = sfdxCommandHelp_1.SfdxCommandHelp;
        this.showShortHelp = false;
        this.commands = [];
        this.subCommands = {};
    }
    async showHelp(argv) {
        this.showShortHelp = argv.includes('-h');
        this.commands = this.config.commandIDs.map((c) => `${this.config.bin} ${c.replace(/:/g, this.config.topicSeparator)}`);
        for (const cmd of this.commands) {
            this.subCommands[cmd] = this.commands
                .filter((c) => c.startsWith(cmd) && c !== cmd)
                .map((c) => `${c.replace(cmd, '')}`);
        }
        return super.showHelp(argv);
    }
    getCommandHelpClass(command) {
        this.commandHelpClass = super.getCommandHelpClass(command);
        this.commandHelpClass.showShortHelp = this.showShortHelp;
        return this.commandHelpClass;
    }
    log(...args) {
        const formatted = args.map((arg) => {
            for (const cmd of this.commands) {
                const regex = this.subCommands[cmd].length > 0
                    ? new RegExp(`(?<!\\$ )${cmd}(?!${this.subCommands[cmd].join('|')})`, 'g')
                    : new RegExp(`(?<!\\$ )${cmd}`, 'g');
                arg = arg.replace(regex, chalk.dim(cmd));
            }
            return arg;
        });
        super.log(...formatted);
    }
}
exports.default = SfdxHelp;
//# sourceMappingURL=sfdxHelp.js.map