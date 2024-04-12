import postgresClient from '../models/postgresClient.js';

async function canAccessRoom(userId, roomType, roomId) {
  switch (roomType) {
    case 'team': {
      const team = await postgresClient.team.findFirst({
        where: {
          AND: [
            { id: roomId },
            { users: { some: { id: userId } } },
          ],
        },
      });
      return team !== null;
    }

    case 'conversation': {
      const conversation = await postgresClient.conversation.findFirst({
        where: {
          AND: [
            { id: roomId },
            { users: { some: { id: userId } } },
          ],
        },
      });
      return conversation !== null;
    }

    case 'channel': {
      const channel = await postgresClient.channel.findFirst({
        where: {
          AND: [
            { id: roomId },
            { patient: { users: { some: { id: userId } } } },
          ],
        },
      });
      return channel !== null;
    }

    default:
      return false;
  }
}

export default canAccessRoom;
