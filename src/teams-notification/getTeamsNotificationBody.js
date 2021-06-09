const core = require('@actions/core');
const { getSections } = require('./sections');
const { getActions } = require('./actions');

function getInitialMessageBody() {
  const title = core.getInput('title');
  const workflowStatus = core.getInput('workflow-status');
  let themeColor = 'cccccc'; //gray

  if (workflowStatus == 'success') {
    themeColor = '2ea44f'; //green
  } else if (workflowStatus == 'failure') {
    themeColor = 'cb2431'; //red
  }

  return {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    themeColor: themeColor,
    summary: 'GitHub Actions Workflow Status',
    title
  };
}

function getTeamsNotificationBody() {
  const notificationBody = {
    ...getInitialMessageBody(),
    sections: getSections(),
    potentialAction: getActions()
  };

  return notificationBody;
}

module.exports = { getTeamsNotificationBody };
