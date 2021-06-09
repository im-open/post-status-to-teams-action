const core = require('@actions/core');
const { context } = require('@actions/github');

function getCustomActions() {
  const customActionsInput = core.getInput('custom-actions');
  const customActionsArray = JSON.parse(customActionsInput);

  if (!customActionsArray) return [];

  return customActionsArray.map(action => ({
    '@type': 'OpenUri',
    name: action.name,
    targets: [
      {
        os: 'default',
        uri: action.uri
      }
    ]
  }));
}

function getActions() {
  const workflowType = core.getInput('workflow-type');
  const generalActions = [
    {
      '@type': 'OpenUri',
      name: `View ${workflowType} Log`,
      targets: [
        {
          os: 'default',
          uri: `https://github.com/${context.repository}/actions/runs/${context.runId}`
        }
      ]
    }
  ];

  return [...generalActions, ...getCustomActions()];
}

module.exports = { getActions };
