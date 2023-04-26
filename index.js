const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs/promises');
const sfdx = require('sfdx-node');

const SFDX_ALIAS = 'targetEnvironment';

async function run() {
  try {
    const serverKey = core.getInput('serverKey');
    const clientId = core.getInput('clientId');
    const username = core.getInput('username');
  
    if (!serverKey) throw new Error('Missing Connected App Certificate');
    if (!clientId) throw new Error('Missing Connected App Client ID');
    if (!username) throw new Error('Missing Salesforce Username');

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  
    const serverKeyFilepath = path.join(process.env['RUNNER_TEMP'], 'server.key');
    console.log('serverKeyFilepath', serverKeyFilepath);
    const fsWriteResult = await fs.writeFile(serverKeyFilepath, serverKey);
    console.log('fsWriteResult', fsWriteResult);

    const fsReadResult = await fs.readFile(serverKeyFilepath, { encoding: 'utf8' });
    console.log('fsReadResult', fsReadResult);

    // sfdx force auth jwt grant --client-id $SFDX_CLIENT_ID --jwt-key-file ./config/server.key --username $SFDX_USERNAME --alias $SFDX_ALIAS
    const result = await sfdx.auth.jwt.grant({
      "_quiet": false,
      "clientid": clientId,
      "jwtkeyfile": serverKeyFilepath,
      "username": username,
      "setalias": SFDX_ALIAS,
    });

    console.log('result', result);

    const result1 = await sfdx.force.org.status({
      "_quiet": false,
      "setalias": SFDX_ALIAS,
    });

    console.log('result1', result1);

    const result2 = sfdx.force.org.status({
      "_quiet": false,
      "setalias": SFDX_ALIAS,
    });

    console.log('result2', result2);

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
// console.log(sfdx.auth.jwt);