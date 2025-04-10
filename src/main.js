var core = require_core();
var { sendTeamsNotification } = require_sendTeamsNotification();
var { getTeamsNotificationBody } = require_getTeamsNotificationBody();

async function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri', { required: true });
  const failOnError = core.getBooleanInput('fail-on-error', { required: false });

  try {
    await sendTeamsNotification(teamsUri, notificationBody);
    console.log('Notification sent successfully.');
  } catch (error) {
    if (failOnError) {
      core.setFailed(`Action failed with error: ${error.message}`);
    } else {
      core.warning(`Action encountered an error but will continue: ${error.message}`);
    }
  }
}

run();
