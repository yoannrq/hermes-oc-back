import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';
import messageService from '../services/message/messageService.js';
import getDateFromMongoObject from '../utils/formatingFunctions/getDateFromMongoObject.js';

export default {
  async getPatients(req, res) {
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
          select: {
            id: true,
          },
        },
      },
    });

    // TODO Utilisation du service lastmessage de Jerome
    const patientInfoById = {};
    await Promise.all(
      patientsWithChannels.map(async (patient) => {
        let lastMessage = null;
        let unreadMessagesCount = 0;
        await Promise.all(patient.channels.map(async (channel) => {
          const roomInfo = await messageService.getRoomInfo({
            roomType: 'channel',
            roomId: channel.id,
            userId: user.id,
          });

          // Récupère la date du dernier message afin de pouvoir la comparer
          const timestampFromCurrentObject = getDateFromMongoObject(roomInfo.lastMessage.id);
          const roomInfoWithDate = {
            ...roomInfo.lastMessage,
            timestamp: timestampFromCurrentObject,
          };

          // Vérifie si le message actuel est plus récent que le dernier message connu
          if (lastMessage === null || timestampFromCurrentObject > lastMessage.timestamp) {
            lastMessage = roomInfoWithDate;
          }

          // Incrémente le nombre de messages non lus pour le patient
          unreadMessagesCount += parseInt(roomInfo.unreadMessagesCount, 10);
        }));

        patientInfoById[patient.id] = {
          ...patient,
          lastMessage,
          unreadMessagesCount,
        };
      }),
    );

    res.status(200).json(patientInfoById);
  },
};
