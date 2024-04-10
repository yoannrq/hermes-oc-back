import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';
import getTimestampFromMongoObject from '../utils/getTimestampFromMongoObject.js';

export default {
  getConversations: async (req, res, next) => {
    const { user } = res.locals;

    try {
      const userConversations = await postgresClient.conversation.findMany({
        where: {
          users: {
            some: {
              email: user.email,
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
            },
            where: {
              email: {
                not: user.email,
              },
            },
          },
        },
      });

      const formatedUserConversations = userConversations.map((conversation) => ({
        conversationid: conversation.id,
        receiver: conversation.users[0],
      }));

      // Parcours chaque conversation pour enrichir les données avec le dernier message et le nombre de messages non lus
      const conversationsWithMessages = await Promise.all(formatedUserConversations.map(async (conversation) => {
        // Récupère le dernier message de la conversation courante
        const lastMessage = await mongoClient.message.findMany({
          where: {
            conversationId: conversation.conversationid,
          },
          orderBy: {
            id: 'desc', // Tri par ordre décroissant pour obtenir le dernier message
          },
          take: 1, // Prend seulement le premier résultat qui est le dernier message
        });

        // Recherche le dernier message lu par l'utilisateur dans cette conversation
        const lastMessageRead = await mongoClient.lastMessageRead.findFirst({
          where: {
            conversationId: conversation.conversationid,
            readerId: user.id, // Filtre par ID de l'utilisateur pour trouver son dernier message lu
          },
        });

        // Initialise le compteur de messages non lus
        let unreadMessagesCount = 0;
        if (lastMessageRead) {
          // Si un dernier message lu est trouvé, compte les messages non lus depuis ce dernier message
          const lastReadMessageId = lastMessageRead.messageId;

          unreadMessagesCount = await mongoClient.message.count({
            where: {
              conversationId: conversation.conversationid,
              id: { gt: lastReadMessageId }, // Compte les messages ayant un ID supérieur au dernier message lu
            },
          });
        } else {
          // Si aucun message n'a été lu, compte tous les messages comme non lus dans cette conversation
          unreadMessagesCount = await mongoClient.message.count({
            where: {
              conversationId: conversation.conversationid,
            },
          });
        }

        // Récupère la date du dernier message pour l'afficher dans la conversation
        const lastMessageDate = lastMessage[0] ? getTimestampFromMongoObject(lastMessage[0]) : null;

        if (lastMessage[0].deleted) {
          lastMessage[0].content = 'This message has been deleted';
        }

        // Compte le nombre total de messages dans la conversation
        const totalMessages = await mongoClient.message.count({
          where: {
            conversationId: conversation.conversationid,
          },
        });

        // Retourne la conversation enrichie avec le dernier message, le nombre de messages non lus et le nombre total de messages
        return {
          ...conversation,
          lastMessage: { content: lastMessage[0].content, date: lastMessageDate }, // Récupère le content du message et la date
          unreadMessagesCount, // Ajoute le nombre de messages non lus à l'objet de la conversation
          totalMessages, // Ajoute le nombre total de messages à l'objet de la conversation
        };
      }));

      return res.status(200).json(conversationsWithMessages);
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },

  newConversation: async (req, res, next) => {
    const { user } = res.locals;
    const { receiverEmail } = req.body;

    try {
      const receiver = await postgresClient.user.findUnique({
        where: { email: receiverEmail },
      });

      if (!receiver) {
        return next({
          status: 404,
          message: 'Receiver not found',
        });
      }

      const conversation = await postgresClient.conversation.create({
        data: {
          users: {
            connect: [
              { email: user.email },
              { email: receiver.email },
            ],
          },
        },
      });

      return res.status(201).json(conversation);
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },

  getOneConversationWithMessages: async (req, res, next) => {
    const { user } = res.locals;
    const conversationId = parseInt(req.params.conversationId, 10);

    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    if (conversationId.isNaN) {
      return next({
        status: 400,
        message: 'Invalidate parameter',
      });
    }

    try {
      const conversation = await postgresClient.conversation.findFirst({
        where: {
          id: conversationId,
          users: {
            some: {
              email: user.email,
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
            },
            where: {
              email: {
                not: user.email,
              },
            },
          },
        },
      });

      if (!conversation) {
        return next({
          status: 404,
          message: 'Conversation not found',
        });
      }

      const totalMessages = await mongoClient.message.count({
        where: {
          conversationId,
        },
      });

      // Calcul du nombre total de pages pour la pagination
      const totalPages = Math.ceil(totalMessages / pageSize);

      // Calcul de l'offset pour servir les messages de la page demandée
      const offset = (page - 1) * pageSize;

      const messages = await mongoClient.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          id: 'asc',
        },
        skip: offset,
        take: pageSize,
      });

      const formatedMessages = messages.map((message) => ({
        id: message.id,
        content: message.content,
        date: getTimestampFromMongoObject(message),
        authorId: message.authorId,
      }));

      return res.status(200).json({
        conversationId: conversation.id,
        receiver: conversation.users[0],
        messages: formatedMessages,
        pagination: {
          page,
          pageSize,
          totalMessages,
          totalPages,
        },
      });
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },
};
