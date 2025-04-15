const https = require('https');

async function sendTeamsNotification(teamsUri, adaptiveCardBody) {
  const payload = JSON.stringify({
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: adaptiveCardBody
      }
    ]
  });

  return new Promise((resolve, reject) => {
    const url = new URL(teamsUri);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, res => {
      let responseBody = '';

      // Collect response data
      res.on('data', chunk => {
        responseBody += chunk;
      });

      // Handle the end of the response
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`Notification sent successfully. Status: ${res.statusCode}`);
        } else {
          reject(
            new Error(
              `Failed to send notification to Teams. HTTP Status: ${res.statusCode} - ${res.statusMessage}. Response: ${responseBody}`
            )
          );
        }
      });
    });

    // Handle request errors
    req.on('error', error => {
      reject(new Error(`Error in sendTeamsNotification: ${error.message}`));
    });

    // Write the payload and end the request
    req.write(payload);
    req.end();
  });
}

module.exports = { sendTeamsNotification };
