const fetch = require('node-fetch')
const { getParameters } = require('./utils')

module.exports.run = async (event) => {
  const { BEEROBOT_SLACK_TOKEN, BEEROBOT_SLACK_CHANNEL } = await getParameters('BEEROBOT_SLACK_TOKEN', 'BEEROBOT_SLACK_CHANNEL')

  const response = await fetch('https://slack.com/api/chat.delete', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BEEROBOT_SLACK_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      channel: BEEROBOT_SLACK_CHANNEL,
      ts: event.ts
    })
  })
  console.log('Delete', event.ts, BEEROBOT_SLACK_CHANNEL, await response.text())

  return { ok: true }
}
