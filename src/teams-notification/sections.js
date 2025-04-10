var core2 = require_core();
var { context } = require_github();
var { getActions } = require_actions();
function getTeamsNotificationBody2() {
  const adaptiveCardBody = getInitialAdaptiveCardBody();
  const sections = getSections();

  // Add sections as additional content in the Adaptive Card
  sections.forEach(section => {
    adaptiveCardBody.body.push({
      type: 'TextBlock',
      text: section.activityTitle,
      weight: 'Bolder',
      spacing: 'Medium'
    });

    adaptiveCardBody.body.push({
      type: 'TextBlock',
      text: section.activitySubtitle,
      spacing: 'Small',
      isSubtle: true
    });

    // Render facts using FactSet
    if (section.facts && section.facts.length > 0) {
      console.log('Adding Facts to Adaptive Card:', section.facts);
      adaptiveCardBody.body.push({
        type: 'FactSet',
        facts: section.facts.map(fact => ({
          title: fact.title,
          value: fact.value
        }))
      });
    }

    // Add potential actions
    if (section.potentialAction && section.potentialAction.length > 0) {
      adaptiveCardBody.body.push({
        type: 'ActionSet',
        actions: section.potentialAction.map(action => ({
          type: 'Action.OpenUrl',
          title: action.name,
          url: action.target[0],
          style: 'positive'
        })),
        spacing: 'Medium'
      });
    }
  });

  console.log('Final Adaptive Card Body:', JSON.stringify(adaptiveCardBody, null, 2));
  return adaptiveCardBody;
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