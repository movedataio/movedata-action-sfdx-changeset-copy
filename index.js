const child = require('child_process');
const core = require('@actions/core');
const path = require('path');
const fs = require('fs/promises');
const sfdx = require('sfdx-node');

const SFDX_ALIAS = 'targetEnvironment';

async function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    child.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout); 
      }
    });
  });
}

async function run(request) {
  if (!request) throw new Error('Missing Request');
  const { serverKeyFilepath, clientId, username, changesetName } = request;

  if (!serverKeyFilepath) throw new Error('Missing Connected App Certificate');
  if (!clientId) throw new Error('Missing Connected App Client ID');
  if (!username) throw new Error('Missing Salesforce Username');
  if (!changesetName) throw new Error('Missing Salesforce Package or Changeset Name');

  const r1 = await execCommand('npm install sfdx-cli --global');
  console.log(r1);

  const r2 = await execCommand('npm install @salesforce/cli --global');
  console.log(r2);

  const r3cmd = `sfdx force auth jwt grant --client-id ${clientId} --jwt-key-file ${serverKeyFilepath} --username ${username} --alias ${SFDX_ALIAS}`;
  console.log(r3cmd);
  const r3 = await execCommand(r3cmd);
  console.log(r3);

  return;

  /*
  // sfdx force auth jwt grant --client-id $SFDX_CLIENT_ID --jwt-key-file ./config/server.key --username $SFDX_USERNAME --alias $SFDX_ALIAS
  const authResult = await sfdx.auth.jwt.grant({
    "_quiet": false,
    "clientid": clientId,
    "jwtkeyfile": serverKeyFilepath,
    "username": username,
    "setalias": SFDX_ALIAS,
  });
  console.log('');
  console.log('authResult', authResult);

  // sfdx force:mdapi:retrieve -u {{Origin Org}} -p {{Change Set Name}} -w 10 -r .
  const mdapiResult = await sfdx.force.mdapi.retrieve({
    "targetusername": SFDX_ALIAS,
    "packagenames": changesetName,
    "retrievetargetdir": "./src",
    "wait": 15,
    "unzip": true,
  });
  console.log('');
  console.log('mdapiResult', mdapiResult);
  */
}

async function runFromCommandLine() {
  const config = JSON.parse(await fs.readFile('./config/details.json'));
  const request = Object.assign({}, { serverKeyFilepath: './config/server.key' }, config);

  return await run(request);
}

async function runFromGithub() {
  try {
    const serverKey = core.getInput('serverKey');
    const clientId = core.getInput('clientId');
    const username = core.getInput('username');
    const changesetName = core.getInput('changesetName');
  
    if (!serverKey) throw new Error('Missing Connected App Certificate');
    if (!clientId) throw new Error('Missing Connected App Client ID');
    if (!username) throw new Error('Missing Salesforce Username');
    if (!changesetName) throw new Error('Missing Salesforce Package or Changeset Name');

    const serverKeyFilepath = path.join(process.env['RUNNER_TEMP'], 'server.key');
    await fs.writeFile(serverKeyFilepath, serverKey);

    const request = {
      serverKeyFilepath,
      clientId,
      username,
      changesetName,
    };

    return await run(request);
  }
  catch (e) {
    core.setFailed(e.message);
  }
}

if (process.env.CI === 'true') {
  console.log('Detected CI:', true);
  runFromGithub();
}
else {
  console.log('Detected CI:', false);
  runFromCommandLine();
}
