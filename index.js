const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const fs = require('fs/promises');

const sfdx = require('sfdx-node');

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

    /*
    // sfdx force auth jwt grant --client-id $SFDX_CLIENT_ID --jwt-key-file ./config/server.key --username $SFDX_USERNAME --alias $SFDX_ALIAS
    const result = await sfdx.force.auth.jwt({
      "client-id": clientId,
      "jwt-key-file": 
    })
    */

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();