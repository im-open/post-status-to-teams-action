var core2 = require_core();
    var { getSections } = require_sections();
    function getInitialAdaptiveCardBody() {
      const title = core2.getInput('title', { required: true });
      const workflowStatus = core2.getInput('workflow-status', { required: true });
      const themeColor = workflowStatus === 'success' ? 'good' : workflowStatus === 'failure' ? 'attention' : 'default';
    
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
    
        // Render general facts as Container elements
        if (section.facts && section.facts.length > 0) {
          console.log('Adding Facts to Adaptive Card:', section.facts);
          section.facts.forEach(fact => {
            adaptiveCardBody.body.push({
              type: 'Container',
              items: [
                {
                  type: 'ColumnSet',
                  columns: [
                    {
                      type: 'Column',
                      width: 'auto',
                      items: [
                        {
                          type: 'TextBlock',
                          text: fact.title, // Title
                          wrap: true,
                          weight: 'Bolder',
                          spacing: 'Small'
                        }
                      ]
                    },
                    {
                      type: 'Column',
                      width: 'stretch',
                      items: [
                        {
                          type: 'Container',
                          items: [
                            {
                              type: 'TextBlock',
                              text: fact.value, // Value
                              wrap: true,
                              weight: 'Default',
                              color: 'default'
                            }
                          ],
                          spacing: 'None', // No extra spacing inside the container
                          padding: 'Small', // Minimal padding around the text
                          style: null, // Remove default emphasis style
                          backgroundImage: null, // No background image
                          border: {
                            color: '#D1D1D1', // Light gray border color
                            thickness: '1px' // Thin border
                          },
                          backgroundColor: '#F3F3F3' // Light gray background for the button-like box
                        }
                      ]
                    }
                  ]
                }
              ],
              spacing: 'Small', // Reduce spacing between rows
              padding: 'None' // Remove extra padding around the entire row
            });
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
    
    module2.exports = { getTeamsNotificationBody: getTeamsNotificationBody2 };