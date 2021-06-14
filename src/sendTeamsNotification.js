const core = require('@actions/core');
const axios = require('axios');

function sendTeamsNotification(teamsUri, body) {
  axios({
    method: 'post',
    url: teamsUri,
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify(body)
  })
    .then(function (response) {
      core.info(response);
    })
    .catch(function (error) {
      if (core.getInput('fail-on-error') === 'true') {
        core.setFailed(error);
      } else {
        core.error(error);
      }
    });
}

module.exports = { sendTeamsNotification };
