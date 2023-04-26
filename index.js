const core = require('@actions/core');
const child = require('child_process');
const path = require('path');
const fs = require('fs/promises');

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

  await core.group('Install SFDX Dependencies', async () => {
    const r1 = await execCommand('npm install sfdx-cli --global');
    console.log(r1);
  });  

  await core.group('Install SF CLI Dependencies', async () => {
    const r2 = await execCommand('npm install @salesforce/cli --global');
    console.log(r2);
  });

  await core.group('Authorise with Salesforce', async () => {
    const r3cmd = `sfdx force auth jwt grant --client-id ${clientId} --jwt-key-file ${serverKeyFilepath} --username ${username} --alias ${SFDX_ALIAS}`;
    console.log('#', r3cmd);
    const r3 = await execCommand(r3cmd);
    console.log(r3);
  });

  const retrievetargetdir = path.join(request.root || './', './src');
  await core.group('Retrieve Changeset from Salesforce', async () => {
    const r4cmd = `sfdx force:mdapi:retrieve --targetusername ${SFDX_ALIAS} --packagenames ${changesetName} --wait 15 --retrievetargetdir ${retrievetargetdir} --unzip`;
    console.log('#', r4cmd);
    const r4 = await execCommand(r4cmd);
    console.log(r4);
  });

  const destDir = request.folder || path.join(process.env.GITHUB_WORKSPACE, './src');
  await core.group('Copy Files to Target Folder', async () => {
    const r5cmd = `cp -r ${retrievetargetdir} ${destDir}`;
    console.log('#', r5cmd);
    const r5 = await execCommand(r5cmd);
    console.log(r5);
  });

  core.setOutput("folder", destDir);
}

async function runFromCommandLine() {
  const config = JSON.parse(await fs.readFile('./config/details.json'));
  const request = Object.assign({}, { root: './', serverKeyFilepath: './config/server.key' }, config);

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
      root: process.env['RUNNER_TEMP'],
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
