import '../helpers/envLoader.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/mongodb/client/index.js';
import { ObjectId } from 'bson';

const mongoClient = new PrismaClient();

/* const message = await mongoClient.message.create({
  data: {
    content: 'Le patient est en salle',
    deleted: false,
    authorId: 6,
    conversationId: 8,
  },
});

const message2 = await mongoClient.message.create({
  data: {
    content: 'Merci pour l\'info',
    deleted: false,
    authorId: 1,
    conversationId: 8,
  },
});

const message3 = await mongoClient.message.create({
  data: {
    content: 'Pas de problème, à bientôt !',
    deleted: false,
    authorId: 6,
    conversationId: 8,
  },
});

const lastMessageRead = await mongoClient.lastMessageRead.create({
  data: {
    messageId: '66159ee2e444bc9541f22148',
    readerId: 6,
    conversationId: 8,
  },
});

console.log(lastMessageRead);
console.log(message);
console.log(message2);
console.log(message3); */

process.on('exit', async () => {
  console.log('Disconnecting from mongo database...');
  await mongoClient.$disconnect();
});

export default mongoClient;
