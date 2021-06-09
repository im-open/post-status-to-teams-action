const core = require('@actions/core');
const { context } = require('@actions/github');

function getGeneralFacts() {
  const status = core.getInput('workflow-status', { required: true });
  const repoUrl = `https://github.com/${context.repository}`;
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
      value: `\`[${branchUrl}](${branchUrl})\``
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
  const customFactsArray = JSON.parse(customFactsInput);

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
    facts: getTheFacts()
  };

  return section;
}

module.exports = { getSections };
