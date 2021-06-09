const core = require('@actions/core');
const { sendTeamsNotification } = require('./sendTeamsNotification');
const {
  getTeamsNotificationBody
} = require('./teams-notification/getTeamsNotificationBody');

function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri');

  sendTeamsNotification(teamsUri, notificationBody);
}

run();
