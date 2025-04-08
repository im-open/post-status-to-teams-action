const core = require('@actions/core'); // Standard Node.js require for @actions/core
const { sendTeamsNotification } = require('./sendTeamsNotification'); // Relative path to sendTeamsNotification.js
const { getTeamsNotificationBody } = require('./getTeamsNotificationBody'); // Relative path to getTeamsNotificationBody.js

function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri', { required: true });

  // Send the Adaptive Card payload
  sendTeamsNotification(teamsUri, notificationBody);
}

run();
