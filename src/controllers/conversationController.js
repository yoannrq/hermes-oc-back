import postgresClient from '../models/postgresClient.js';

import messageService from '../services/message/messageService.js';

export default {
  async getConversations(req, res, next) {
    const { user } = res.locals;

    try {
      const conversations = await postgresClient.conversation.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
              profilePictureUrl: true,
              rppsCode: true,
            },
            where: {
              id: {
                not: user.id,
              },
            },
          },
        },
      });

      const roomsInfoById = {};
      await Promise.all(
        conversations.map(async (conversation) => {
          const roomInfo = await messageService.getRoomInfo({
            roomType: 'conversation',
            roomId: conversation.id,
            userId: user.id,
          });
          roomsInfoById[conversation.id] = roomInfo;
        }),
      );

      return res.json(
        conversations.map((conversation) => {
          const roomInfo = roomsInfoById[conversation.id];

          return {
            conversationid: conversation.id,
            receiver: conversation.users[0],
            ...roomInfo,
          };
        }),
      );
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  async newConversation(req, res, next) {
    const { user } = res.locals;

    // Todo: Check user input with zod
    const { receiverId } = req.body;

    try {
      const receiver = await postgresClient.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        return next({
          status: 404,
          message: 'Receiver not found',
        });
      }

      // Only one conversation between two users at a time
      const existingConversation = await postgresClient.conversation.findFirst({
        where: {
          users: {
            every: {
              id: { in: [user.id, receiver.id] },
            },
          },
        },
      });

      if (existingConversation) {
        return res.json({
          created: false,
          ...existingConversation,
        });
      }

      const conversation = await postgresClient.conversation.create({
        data: {
          users: {
            connect: [{ email: user.email }, { email: receiver.email }],
          },
        },
      });

      return res.status(201).json({
        created: true,
        ...conversation,
      });
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },
};
