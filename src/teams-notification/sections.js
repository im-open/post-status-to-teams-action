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
      type: 'Container',
      items: [
        {
          type: 'TextBlock',
          text: `Event Type: \`${context.eventName}\``,
          wrap: true,
          weight: 'Bolder',
          color: 'default'
        }
      ],
      style: 'emphasis',
      spacing: 'Small',
      padding: 'Default'
    },
    {
      type: 'Container',
      items: [
        {
          type: 'TextBlock',
          text: `Status: \`${status}\``,
          wrap: true,
          weight: 'Bolder',
          color: 'default'
        }
      ],
      style: 'emphasis',
      spacing: 'Small',
      padding: 'Default'
    },
    {
      type: 'Container',
      items: [
        {
          type: 'TextBlock',
          text: `Ref: [${branchUrl}](${branchUrl})`,
          wrap: true,
          weight: 'Bolder',
          color: 'accent'
        }
      ],
      style: 'emphasis',
      spacing: 'Small',
      padding: 'Default'
    }
  ];

  // Updated console.log to output JSON format
  console.log('Generated General Facts:', JSON.stringify(generalFacts, null, 2));
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

  console.log('All Facts:', JSON.stringify(allFacts, null, 2));
  return allFacts;
}
function getSections() {
  const workflowType = core2.getInput('workflow-type', { required: true });
  const workflowStatus = core2.getInput('workflow-status', {
    required: true
  });
  const timeZone = core2.getInput('timezone') || 'UTC'; // Default to UTC if not provided

  let formattedDate;
  try {
    formattedDate = new Date().toLocaleString('en-us', {
      timeZone
    });
  } catch (error) {
    console.warn(`Invalid timezone provided: ${timeZone}. Falling back to UTC.`);
    formattedDate = new Date().toLocaleString('en-us', {
      timeZone: 'UTC'
   });
}

const section = {
  activityTitle: `${workflowType} ${workflowStatus}`,
  activitySubtitle: formattedDate,
  facts: getTheFacts(),
  potentialAction: getActions()
};
console.log('Generated Section:', section);
return [section];
}
module2.exports = { getSections };