export default {
  message: {
    type: 'object',
    required: ['content', 'deleted', 'author_id'],
    properties: {
      id: { type: 'integer', description: 'The auto-generated id for the message.' },
      content: { type: 'string', description: "Message's content." },
      deleted: { type: 'boolean', description: 'Message is deleted or not.' },
      related_at: { type: 'integer', description: 'Message related at.' },
      author_id: { type: 'integer', description: "Message's sender id." },
      conversation_id: { type: 'integer', description: "Message's conversation id." },
      team_id: { type: 'integer', description: "Message's team id." },
      channel_id: { type: 'integer', description: "Message's channel id." },
    },
    example: {
      id: 2,
      content: 'Hello',
      deleted: false,
      related_at: 1,
      author_id: 2,
      conversation_id: 1,
      team_id: null,
      channel_id: null,
    },
  },
};
