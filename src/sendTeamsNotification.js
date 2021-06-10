const core = require('@actions/core');
const axios = require('axios');

function sendTeamsNotification(teamsUri, body) {
  core.info(JSON.stringify(body));
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
      core.info(error);
    });
}

module.exports = { sendTeamsNotification };
