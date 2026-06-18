import * as core from '@actions/core';
import getSections from './sections';

function getInitialMessageBody() {
  const title = core.getInput('title', { required: true });
  const workflowStatus = core.getInput('workflow-status', { required: true });
  let themeColor = 'cccccc'; //gray

  if (workflowStatus == 'success') {
    themeColor = '2ea44f'; //green
  } else if (workflowStatus == 'failure') {
    themeColor = 'cb2431'; //red
  }

  return {
    '@type': 'MessageCard',
    themeColor: themeColor,
    summary: 'GitHub Actions Workflow Status',
    title
  };
}

export default function getTeamsNotificationBody() {
  const notificationBody = {
    ...getInitialMessageBody(),
    sections: getSections()
  };

  return notificationBody;
}
