import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';

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
    // Utilisation de Promise.all pour exécuter simultanément plusieurs requêtes asynchrones
    const patientsWithLastMessage = await Promise.all(
      patientsWithChannels.map(async (patient) => {
        // Extraire les IDs de tous les canaux du patient pour les insérer dans un tableau
        const arrayChannels = patient.channels.map((channel) => channel.id).flat();

        // Récupérer le dernier message des canaux du patient
        const lastMessage = await mongoClient.message.findMany({
          where: {
            AND: [
              {
                channelId: {
                  in: arrayChannels, // Recherche dans tous les canaux de ce patient
                },
              },
            ],
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        });

        if (lastMessage[0].deleted) {
          lastMessage[0].content = 'This message has been deleted';
        }

        return {
          id: patient.id,
          firstname: patient.firstname,
          lastname: patient.lastname,
          birthdate: patient.birthdate,
          socialSecurityNumber: patient.socialSecurityNumber,
          phoneNumber: patient.phoneNumber,
          email: patient.email,
          address: patient.address,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
          lastMessage: lastMessage[0],
        };
      }),
    );

    res.status(200).json(patientsWithLastMessage);
  },
};
