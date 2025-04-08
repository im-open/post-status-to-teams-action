const core = require('@actions/core');
const { sendTeamsNotification } = require('./sendTeamsNotification');
const { getTeamsNotificationBody } = require('./getTeamsNotificationBody');

// Debugging: Log the imported sendTeamsNotification function
console.log('sendTeamsNotification:', sendTeamsNotification);

function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri', { required: true });

  // Send the Adaptive Card payload
  sendTeamsNotification(teamsUri, notificationBody);
}

run();
