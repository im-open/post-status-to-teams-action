var core = require_core();
var { sendTeamsNotification } = require_sendTeamsNotification();
var { getTeamsNotificationBody } = require_getTeamsNotificationBody();

async function run() {
  const notificationBody = getTeamsNotificationBody();
  console.log('Notification Body:', notificationBody); // Add this log to verify
  const teamsUri = core.getInput('teams-uri', { required: true });
  const failOnError = core.getBooleanInput('fail-on-error', { required: false });

  try {
    // Wait for the sendTeamsNotification function to complete
    const result = await sendTeamsNotification(teamsUri, notificationBody);
    console.log(result); // Log the success message
  } catch (error) {
    // Handle errors based on the fail-on-error input
    if (failOnError) {
      core.setFailed(`Action failed with error: ${error.message}`);
    } else {
      core.warning(`Action encountered an error but will continue: ${error.message}`);
    }
  }
}

run();
