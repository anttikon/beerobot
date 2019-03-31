import messageUtils from '../src/messages'

describe('getMessagesWithText', () => {
  it('should return empty array if parameter is null', () => {
    const messages = messageUtils.getMessagesWithText()
    expect(messages).toEqual([])
  })

  it('shoudl return messages with text', () => {
    const dummyMessages = [
      { text: 'koiruli' },
      { horse: true },
      { text: 'juuuuh' }
    ]
    const messages = messageUtils.getMessagesWithText(dummyMessages)
    expect(messages).toEqual(
      [{ 'text': 'koiruli' }, { 'text': 'juuuuh' }]
    )
  })
})
