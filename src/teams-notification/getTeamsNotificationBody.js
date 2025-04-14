const core = require('@actions/core');
const { getSections } = require('./sections');
function getInitialAdaptiveCardBody() {
  const title = core.getInput('title', { required: true });
  const workflowStatus = core.getInput('workflow-status', { required: true });
  const themeColor =
    workflowStatus === 'success'
      ? 'good'
      : workflowStatus === 'failure'
      ? 'attention'
      : 'default';

  return {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        text: title,
        weight: 'Bolder',
        size: 'Large',
        color: themeColor,
        isSubtle: themeColor === 'default' // Apply subtle styling for non-success/failure statuses
      }
    ]
  };
}
function getTeamsNotificationBody() {
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

    // Render the styled Status fact
    if (section.statusFact) {
      adaptiveCardBody.body.push(section.statusFact);
    }

    // Render facts using FactSet
    if (section.facts && section.facts.length > 0) {
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

  return adaptiveCardBody;
}

module.exports = { getTeamsNotificationBody };
