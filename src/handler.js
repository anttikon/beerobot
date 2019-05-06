const Lambda = require('aws-sdk/clients/lambda')
const lambda = new Lambda()
const { getParameters } = require('./utils')

const isMessagePostedToConfiguredChannel = (slackEvent, configuredSlackChannelId) => !!slackEvent && !!slackEvent.event && slackEvent.event.channel === configuredSlackChannelId
const messageContainsText = (slackEvent) => !!slackEvent && !!slackEvent.event && !!slackEvent.event.text && !!slackEvent.event.text.trim()

const createResponse = (json) => ({
  statusCode: 200,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(json)
})

async function handleRequest(slackEvent) {
  console.log(`user: ${slackEvent.event.user}, ts: ${slackEvent.event.ts}`)

  const { BEEROBOT_SLACK_DELETE_LAMBDA, BEEROBOT_SLACK_CHANNEL, BEEROBOT_SLACK_EVENT_TOKEN } = await getParameters('BEEROBOT_SLACK_DELETE_LAMBDA', 'BEEROBOT_SLACK_CHANNEL', 'BEEROBOT_SLACK_EVENT_TOKEN')

  if (!BEEROBOT_SLACK_CHANNEL) {
    throw new Error('Missing BEEROBOT_SLACK_CHANNEL')
  } else if (!BEEROBOT_SLACK_DELETE_LAMBDA) {
    throw new Error('Missing BEEROBOT_SLACK_DELETE_LAMBDA')
  }

  if (slackEvent.token !== BEEROBOT_SLACK_EVENT_TOKEN) {
    return false
  }

  const shouldRemoveMessage = isMessagePostedToConfiguredChannel(slackEvent, BEEROBOT_SLACK_CHANNEL) && messageContainsText(slackEvent)

  if (shouldRemoveMessage) {
    const params = {
      FunctionName: BEEROBOT_SLACK_DELETE_LAMBDA,
      InvocationType: 'Event',
      LogType: 'None',
      Payload: JSON.stringify({ ts: slackEvent.event.ts })
    }
    await lambda.invoke(params).promise()
  }
  return true
}

module.exports.run = async (event) => {
  const slackEvent = JSON.parse(event.body)

  if (slackEvent.challenge) {
    return createResponse({ challenge: slackEvent.challenge })
  }

  return handleRequest(slackEvent)
    .then(action => createResponse({ action }))
    .catch(e => {
      console.log('Error', e.message)
      return createResponse({ action: false })
    })
}
