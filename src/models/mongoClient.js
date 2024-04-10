import '../helpers/envLoader.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/mongodb/client/index.js';
// import { ObjectId } from 'bson';

const mongoClient = new PrismaClient();

const permission = await mongoClient.permission.create({
  data: {
    name: 'CanReadUsers',
    roleId: 5,
    tableName: 'users',
  },
});

const message = await mongoClient.message.create({
  data: {
    content: 'Hello, world!',
    deleted: false,
    authorId: 56,
    conversationId: 34,
  },
});

console.log(permission);
console.log(message);
console.log(new ObjectId(permission.id).getTimestamp());

process.on('exit', async () => {
  console.log('Disconnecting from mongo database...');
  await mongoClient.$disconnect();
});

export default mongoClient;
