var core2 = require_core();
    var { getSections } = require_sections();
    function getInitialAdaptiveCardBody() {
      const title = core2.getInput('title', { required: true });
      const workflowStatus = core2.getInput('workflow-status', { required: true });
      const themeColor = workflowStatus === 'success' ? 'good' : workflowStatus === 'failure' ? 'attention' : 'accent';
    
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
            color: themeColor
          }
        ]
      };
    }
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
    
        // Add the activitySubtitle (formatted date with timezone)
        adaptiveCardBody.body.push({
          type: 'TextBlock',
          text: section.activitySubtitle, // This includes the formatted date and timezone
          spacing: 'Small',
          isSubtle: true // Optional: Makes the text appear less prominent
        });

        if (section.facts && section.facts.length > 0) {
          adaptiveCardBody.body.push({
            type: 'FactSet',
            facts: section.facts.map(fact => ({
              title: fact.name,
              value: fact.value
            }))
          });
        }
    
        if (section.potentialAction && section.potentialAction.length > 0) {
          section.potentialAction.forEach(action => {
            adaptiveCardBody.body.push({
              type: 'ActionSet',
              actions: [
                {
                  type: 'Action.OpenUrl',
                  title: action.name,
                  url: action.target[0]
                }
              ]
            });
          });
        }
      });
    
      return adaptiveCardBody;
    }
    
    module2.exports = { getTeamsNotificationBody: getTeamsNotificationBody2 };