import messageUtils from './messages'

const { SLACK_TOKEN, SLACK_CHANNEL, SLACK_MESSAGE_COUNT = 500, MESSAGE_REMOVE_LIMIT = 50 } = process.env

messageUtils.fetchMessages(SLACK_TOKEN, SLACK_CHANNEL, SLACK_MESSAGE_COUNT)
  .then(response => messageUtils.getMessagesWithText(response))
  .then(messages => messageUtils.removeMessages(SLACK_TOKEN, SLACK_CHANNEL, MESSAGE_REMOVE_LIMIT, messages))

