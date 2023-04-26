"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SfdxCommandHelp = void 0;
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@oclif/core");
class SfdxCommandHelp extends core_1.CommandHelp {
    constructor(command, config, opts) {
        super(command, config, opts);
        this.command = command;
        this.config = config;
        this.opts = opts;
        this.shortHelp = false;
    }
    get showShortHelp() {
        return this.shortHelp;
    }
    set showShortHelp(shortHelp) {
        this.shortHelp = shortHelp;
    }
    sections() {
        const sections = super.sections();
        if (this.shortHelp) {
            return sections.filter(({ header }) => ['USAGE', 'ARGUMENTS', 'FLAGS'].includes(header));
        }
        const additionaSfSections = [
            {
                header: 'CONFIGURATION VARIABLES',
                generate: ({ cmd }) => {
                    const sfCommand = cmd;
                    return sfCommand.configurationVariablesSection;
                },
            },
            {
                header: 'ENVIRONMENT VARIABLES',
                generate: ({ cmd }) => {
                    const sfCommand = cmd;
                    return sfCommand.envVariablesSection;
                },
            },
            {
                header: 'ERROR CODES',
                generate: ({ cmd }) => {
                    const sfCommand = cmd;
                    return sfCommand.errorCodes;
                },
            },
        ];
        const flagsIndex = (sections.findIndex((section) => section.header === 'FLAG DESCRIPTIONS') || sections.length - 1) + 1;
        sections.splice(flagsIndex, 0, additionaSfSections[0]);
        sections.splice(flagsIndex + 1, 0, additionaSfSections[1]);
        sections.splice(flagsIndex + 2, 0, additionaSfSections[2]);
        return sections;
    }
}
exports.SfdxCommandHelp = SfdxCommandHelp;
//# sourceMappingURL=sfdxCommandHelp.js.map