import fetch from 'node-fetch'

const wait = require('util').promisify(setTimeout)

function getMessagesWithText(messages) {
  if (!messages) {
    return []
  }
  return messages.filter(message => message.text && !!message.text.trim())
}

async function fetchMessages(SLACK_TOKEN, SLACK_CHANNEL, SLACK_MESSAGE_COUNT) {
  const response = await fetch(
    `https://slack.com/api/channels.history?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&count=${SLACK_MESSAGE_COUNT}`
  )
  const json = await response.json()
  return json.messages
}

async function removeMessages(SLACK_TOKEN, SLACK_CHANNEL, MESSAGE_REMOVE_LIMIT, messages) {
  if (messages.length > MESSAGE_REMOVE_LIMIT) {
    throw new Error(`Not going to remove anything because there is too many messages: ${messages.length}.`)
  }

  for (const message of messages) {
    const { ts } = message
    const response = await fetch(`https://slack.com/api/chat.delete?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&ts=${ts}`)
    console.log('Delete', message, await response.text())
    await wait(5000)
  }
}

export default {
  getMessagesWithText, removeMessages, fetchMessages
}
