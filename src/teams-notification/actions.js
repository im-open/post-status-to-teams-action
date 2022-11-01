const core = require('@actions/core');
const { context } = require('@actions/github');

function getCustomActions() {
  const customActionsInput = core.getInput('custom-actions');
  const customActionsArray = customActionsInput
    ? JSON.parse(customActionsInput)
    : [];

  if (!customActionsArray) return [];

  return customActionsArray.map(action => ({
    '@context': 'http://schema.org',
    '@type': 'ViewAction',
    name: action.name,
    target: [action.uri]
  }));
}

function getActions() {
  const workflowType = core.getInput('workflow-type', { required: true });
  const generalActions = [
    {
      '@context': 'http://schema.org',
      '@type': 'ViewAction',
      name: `View ${workflowType} Log`,
      target: [
        `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${context.runId}`
      ]
    }
  ];

  return [...generalActions, ...getCustomActions()];
}

module.exports = { getActions };
