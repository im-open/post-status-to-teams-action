const core = require('@actions/core');
const { context } = require('@actions/github');
const { getActions } = require('./actions');

function getGeneralFacts() {
  const status = core.getInput('workflow-status', { required: true });
  const repoUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
  const branchUrl = `${repoUrl}/tree/${context.ref}`;

  const generalFacts = [
    {
      name: 'Event Type: ',
      value: `\`${context.eventName}\``
    },
    {
      name: 'Status: ',
      value: `\`${status}\``
    },
    {
      name: 'Repository & branch: ',
      value: `[${branchUrl}](${branchUrl})`
    }
  ];

  return generalFacts;
}

function getConditionalFacts() {
  const conditionalFacts = [];
  const environment = core.getInput('environment');

  if (environment) {
    conditionalFacts.push({
      name: 'Environment: ',
      value: environment
    });
  }

  return conditionalFacts;
}

function getTheFacts() {
  const customFactsInput = core.getInput('custom-facts');
  const customFactsArray = customFactsInput ? JSON.parse(customFactsInput) : [];

  return [
    ...getGeneralFacts(),
    ...getConditionalFacts(),
    ...(customFactsArray || [])
  ];
}

function getSections() {
  const workflowType = core.getInput('workflow-type');
  const workflowStatus = core.getInput('workflow-status');
  const timeZone = core.getInput('timezone');
  const section = {
    activityTitle: `${workflowType} ${workflowStatus}`,
    activitySubtitle: new Date().toLocaleString('en-us', {
      timeZone
    }),
    facts: getTheFacts(),
    potentialAction: getActions()
  };

  return [section];
}

module.exports = { getSections };
