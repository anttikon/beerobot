const aws = require('aws-sdk')
const sqs = new aws.SQS({ apiVersion: '2012-11-05' })
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

  const { SLACK_CHANNEL, SLACK_EVENT_TOKEN, SQS_URL } = await getParameters('SLACK_CHANNEL', 'SLACK_EVENT_TOKEN', 'SQS_URL')

  if (slackEvent.token !== SLACK_EVENT_TOKEN) {
    return false
  }

  const shouldRemoveMessage = isMessagePostedToConfiguredChannel(slackEvent, SLACK_CHANNEL) && messageContainsText(slackEvent)

  if (shouldRemoveMessage) {
    await sqs.sendMessage({
      MessageBody: JSON.stringify({ ts: slackEvent.event.ts }),
      QueueUrl: SQS_URL
    }).promise()
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
