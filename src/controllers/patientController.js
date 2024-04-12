import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';
import getTimestampFromMongoObject from '../utils/getTimestampFromMongoObject.js';

export default {
  getPatients: async (req, res, next) => {
    const { user } = res.locals;

    const patientsWithChannels = await postgresClient.patient.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        channels: {
          include: {
            channelType: true,
          },
        },
      },
    });

    let patientsWithChannelsAndMessages = [];

    for (const patient of patientsWithChannels) {
      // Parcours chaque channel pour enrichir les données avec le dernier message et le nombre de messages non lus
      const channelsWithMessages = await Promise.all(patient.channels.map(async (channel) => {
        // Récupère le dernier message du channel courant
        const lastMessage = await mongoClient.message.findMany({
          where: {
            channelId: channel.id,
          },
          orderBy: {
            id: 'desc', // Tri par ordre décroissant pour obtenir le dernier message
          },
          take: 1, // Prend seulement le premier résultat qui est le dernier message
        });

        // Recherche le dernier message lu par l'utilisateur dans ce channel
        const lastMessageRead = await mongoClient.lastMessageRead.findFirst({
          where: {
            channelId: channel.id,
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
              channelId: channel.id,
              id: { gt: lastReadMessageId }, // Selectionne les messages ayant un ID supérieur au dernier message lu
            },
          });
        } else {
          // Si aucun message n'a été lu, compte tous les messages comme non lus dans ce channel
          unreadMessagesCount = await mongoClient.message.count({
            where: {
              channelId: channel.id,
            },
          });
        }

        // Récupère la date du dernier message pour l'afficher dans le channel
        const lastMessageDate = lastMessage[0] ? getTimestampFromMongoObject(lastMessage[0]) : null;

        if (lastMessage[0].deleted) {
          lastMessage[0].content = 'This message has been deleted';
        }

        // Compte le nombre total de messages dans le channel
        const totalMessages = await mongoClient.message.count({
          where: {
            channelId: channel.id,
          },
        });

        // Retourne le channel enrichie avec le dernier message, le nombre de messages non lus et le nombre total de messages
        return {
          ...channel,
          lastMessage: { content: lastMessage[0].content, date: lastMessageDate }, // Récupère le content du message et la date
          unreadMessagesCount, // Ajoute le nombre de messages non lus à l'objet du channel
          totalMessages, // Ajoute le nombre total de messages à l'objet du channel
        };
      }));
      patientsWithChannelsAndMessages.push({
        ...patient,
        channels: channelsWithMessages
      });
    }

    const formatedPatientsWithChannelsAndMessages = patientsWithChannelsAndMessages.map((patient) => {
      const formatedChannels = patient.channels.map((channel) => {
        return {
          id: channel.id,
          name: channel.channelType.name,
          color: channel.channelType.color,
          order: channel.channelType.order,
          lastMessage: channel.lastMessage,
          unreadMessagesCount: channel.unreadMessagesCount,
          totalMessages: channel.totalMessages,
        };
      });

      return {
        id: patient.id,
        firstname: patient.firstname,
        lastname: patient.lastname,
        channels: formatedChannels,
      };
    });

    res.status(200).json(formatedPatientsWithChannelsAndMessages);
  },
};
