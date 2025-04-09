async function sendTeamsNotification(teamsUri, adaptiveCardBody) {
  const payload = {
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: adaptiveCardBody
      }
    ]
  };

  const response = await fetch(teamsUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text(); // Optional: Log response body for debugging
    throw new Error(`Failed to send notification to Teams: ${response.statusText}. Response: ${errorBody}`);
  }
}

module2.exports = { sendTeamsNotification };
