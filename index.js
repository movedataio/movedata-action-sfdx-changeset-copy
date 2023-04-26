const core = require('@actions/core');
const github = require('@actions/github');

const sfdx = require('sfdx-node');

async function run() {
  try {
    const serverKey = core.getInput('serverKey');
    const clientId = core.getInput('clientId');
    const username = core.getInput('username');
  
    console.log(`Hello ${serverKey === null}!`);
  
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  
    /*
    // sfdx force auth jwt grant --client-id $SFDX_CLIENT_ID --jwt-key-file ./config/server.key --username $SFDX_USERNAME --alias $SFDX_ALIAS
    sfdx.force.auth.jwt({
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