var core2 = require_core();
var { context } = require_github();
var { getActions } = require_actions();
function getGeneralFacts() {
  const includeGeneralFacts = core2.getBooleanInput('include-default-facts', {
    required: false
  });
  if (!includeGeneralFacts) {
    console.log('General facts are disabled (include-default-facts is false).');
    return [];
  }

  const status = core2.getInput('workflow-status', { required: true });
  const repoUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
  let ref = context.ref;
  if (ref.startsWith('refs/pull/')) {
    ref = ref.substring('refs/'.length);
  } else {
    ref = `tree/${ref}`;
  }
  const branchUrl = `${repoUrl}/${ref}`;

  const generalFacts = [
    {
      title: 'Event Type',
      value: `\`${context.eventName}\``
    },
    {
      title: 'Ref',
      value: `[${branchUrl}](${branchUrl})`
    }
  ];

  const statusFact = {
    type: 'TextBlock',
    text: `Status: \`${status}\``,
    color: status === 'success' ? 'good' : status === 'failure' ? 'attention' : 'default',
    wrap: true,
    weight: 'Bolder'
  };

  return generalFacts;
}
function getConditionalFacts() {
  const conditionalFacts = [];
  const environment = core2.getInput('environment');
  if (environment) {
    conditionalFacts.push({
      name: 'Environment: ',
      value: environment
    });
  }
  return conditionalFacts;
}
function getTheFacts() {
  const customFactsInput = core2.getInput('custom-facts');
  const customFactsArray = customFactsInput
    ? JSON.parse(customFactsInput).map(fact => ({
        title: fact.name || 'Custom Fact', // Use a default title if missing
        value: fact.value || ''
      }))
    : [];

  const allFacts = [
    ...getGeneralFacts(), // General facts
    ...getConditionalFacts(), // Conditional facts
    ...(customFactsArray || []) // Custom facts
  ];

  return allFacts;
}
function getSections() {
  const workflowType = core2.getInput('workflow-type', { required: true });
  const workflowStatus = core2.getInput('workflow-status', {required: true });
  const timeZone = core2.getInput('timezone') || 'UTC'; // Default to UTC if not provided

  let formattedDate;
  try {
    formattedDate = new Date().toLocaleString('en-us', {
      timeZone
    });
  } catch (error) {
    console.warn(`Invalid timezone provided: ${timeZone}. Falling back to UTC.`);
    formattedDate = new Date().toLocaleString('en-us', { timeZone: 'UTC' });
   }

  const generalFacts = getGeneralFacts();
  const status = core2.getInput('workflow-status', { required: true });
  const statusFact = {
    type: 'ColumnSet',
    columns: [
      {
        type: 'Column',
        width: 'auto',
        items: [
          {
            type: 'TextBlock',
            text: 'Status:', // Title remains in black
            wrap: true,
            weight: 'Bolder',
            spacing: 'Small'
          }
        ]
      },
      {
        type: 'Column',
        width: 'auto',
        items: [
          {
            type: 'TextBlock',
            text: `\`${status}\``, // Value is styled dynamically
            color: status === 'success' ? 'good' : status === 'failure' ? 'attention' : 'default',
            wrap: true,
            weight: 'Default',
            spacing: 'Small'
          }
        ]
      }
    ]
  };

  const section = {
    activityTitle: `${workflowType} ${workflowStatus}`,
    activitySubtitle: formattedDate,
    facts: [...generalFacts, ...getConditionalFacts(), ...getTheFacts()],
    statusFact, // Add the styled Status fact
    potentialAction: getActions()
  };
  return [section];
}
module2.exports = { getSections };