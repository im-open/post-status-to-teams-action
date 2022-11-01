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
      if (core.getBooleanInput('fail-on-error')) {
        core.setFailed(error.message);
      } else {
        core.error(error.message);
      }
    });
}

module.exports = { sendTeamsNotification };
