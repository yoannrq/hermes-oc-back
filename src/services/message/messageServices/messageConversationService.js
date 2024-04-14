import postgresClient from '../../../models/postgresClient.js';
import mongoClient from '../../../models/mongoClient.js';

export default {
  async canAccessRoom({ roomId, userId }) {
    const conversation = await postgresClient.conversation.findFirst({
      where: {
        AND: [{ id: roomId }, { users: { some: { id: userId } } }],
      },
    });
    return conversation !== null;
  },
};
