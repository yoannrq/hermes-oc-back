import postgresClient from '../models/postgresClient.js';

export default {
  getConversations: async (req, res, next) => {
    const { user } = res.locals;

    try {
      const userWithConversations = await postgresClient.user.findUnique({
        where: { email: user.email },
        include: {
          conversations: {
            include: {
              users: {
                select: {
                  email: true,
                },
                where: {
                  email: {
                    not: user.email,
                  },
                },
              },
            },
          },
        },
      });

      if (!userWithConversations) {
        return next({
          status: 404,
          message: 'User not found',
        });
      }

      // Formatage des données pour renvoyer uniquement l'id de la conversation et l'email du destinataire
      const conversations = userWithConversations.conversations.map(
        (conversation) => {
          const users = conversation.users.map((receiver) => receiver.email);
          return {
            id: conversation.id,
            receiver: users[0],
          };
        },
      );

      return res.status(200).json(conversations);
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },
};
