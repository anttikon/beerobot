const fetch = require('node-fetch')
const { getParameters } = require('./utils')

module.exports.run = async (event) => {
  const { SLACK_TOKEN, SLACK_CHANNEL } = await getParameters('SLACK_TOKEN', 'SLACK_CHANNEL', 'SLACK_EVENT_TOKEN')

  for (const record of event.Records) {
    const body = JSON.parse(record.body)
    const response = await fetch('https://slack.com/api/chat.delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        ts: body.ts
      })
    })
    console.log('Delete', body.ts, SLACK_CHANNEL, await response.text())
  }

  return { ok: true }
}
