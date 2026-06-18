import * as core from '@actions/core';
import sendTeamsNotification from './sendTeamsNotification';
import getTeamsNotificationBody from './teams-notification/getTeamsNotificationBody';

function run() {
  const notificationBody = getTeamsNotificationBody();
  const teamsUri = core.getInput('teams-uri', { required: true });

  sendTeamsNotification(teamsUri, notificationBody);
}

run();
