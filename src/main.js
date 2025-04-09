var core = require_core();
var { sendTeamsNotification } = require_sendTeamsNotification();
var { getTeamsNotificationBody } = require_getTeamsNotificationBody();
function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri', { required: true });

  sendTeamsNotification(teamsUri, notificationBody);
}
run();
