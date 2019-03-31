import fetch from 'node-fetch'

const wait = require('util').promisify(setTimeout)

const {SLACK_TOKEN, SLACK_CHANNEL, SLACK_MESSAGE_COUNT = 500, MESSAGE_REMOVE_LIMIT = 50} = process.env

async function fetchMessages(token, channel, messageCount) {
    const response = await fetch(`https://slack.com/api/channels.history?token=${token}&channel=${channel}&count=${messageCount}`)
    return response.json()
}

function getMessagesWithText(apiResponse) {
    return apiResponse.messages.filter(message => !!message.text.trim())
}

async function removeMessages(messages) {
    if (messages.length > MESSAGE_REMOVE_LIMIT) {
        throw new Error(`Not going to remove anything because there is too many messages: ${messages.length}.`)
    }

    for (const message of messages) {
        const {ts} = message
        const response = await fetch(`https://slack.com/api/chat.delete?token=${SLACK_TOKEN}&channel=${SLACK_CHANNEL}&ts=${ts}`)
        console.log('Delete', message, await response.text())
        await wait(5000)
    }
}

fetchMessages(SLACK_TOKEN, SLACK_CHANNEL, SLACK_MESSAGE_COUNT)
    .then(response => getMessagesWithText(response))
    .then(messages => removeMessages(messages))
