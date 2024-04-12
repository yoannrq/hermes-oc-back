import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';

export default {
  createMessage: async (req, res, next) => {
    const { user } = res.locals;
    const { conversationId, channelId, teamId, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if ((conversationId && channelId) || (conversationId && teamId) || (channelId && teamId)) {
      return next({
        status: 400,
        message: 'You must provide only one of conversationId, channelId or teamId',
      });
    }

  try {
    let entryType;
    let entryId;

    if (conversationId) {
      entryType = 'conversationId';
      entryId = parseInt(conversationId, 10);
    } else if (channelId) {
      entryType = 'channelId';
      entryId = parseInt(channelId, 10);

      // Vérification que l'utilisateur est bien associé au patient
      const patientId = await postgresClient.channel.findFirst({
        where: { id: entryId },
        select: { patientId: true },
      });

      const isAssociatedWithPatient = await postgresClient.patient.findFirst({
        where: {
          AND: [
            { id: patientId.patientId },
            { users: 
              { some: 
                { 
                  email: user.email 
                } 
              } 
            },
          ],
        },
      });

      if (!isAssociatedWithPatient) {
        return res.status(403).json({ message: 'This user is not associated with the patient'});
      }

    } else if (teamId) {
      entryType = 'teamId';
      entryId = parseInt(teamId, 10);

      // Vérification que l'utilisateur est bien membre de l'équipe
      const isInTeam = await postgresClient.team.findFirst({
        where: {
          AND: [
            { id: entryId },
            { users: 
              { some: 
                { 
                  email: user.email 
                } 
              } 
            },
          ],
        },
      });

      if (!isInTeam) {
        return res.status(403).json({ message: 'Not member of the team'});
      }

    } else {
      return res.status(400).json({
        status: 400,
        message: 'Missing conversationId, channelId, or teamId',
      });
    }

      const newMessage = await mongoClient.message.create({
        data: {
          [entryType]: entryId,
          authorId: user.id,
          content,
          deleted: false,
        },
      });

      console.log('newMessage', newMessage);

      // Mise à jour du dernier message lu par l'utilisateur
      const lastMessageRead = await mongoClient.lastMessageRead.findFirst({
        where: {
          AND: [
            { readerId: parseInt(user.id, 10) },
            { [entryType]: entryId },
          ],
        },
      });

      if (lastMessageRead) {
        await mongoClient.lastMessageRead.update({
          where: { id: lastMessageRead.id },
          data: {
            messageId: newMessage.id,
          },
        });
      } else {
        await mongoClient.lastMessageRead.create({
          data: {
            messageId: newMessage.id,
            readerId: parseInt(user.id, 10),
            [entryType]: entryId,
          },
        });
      }

      return res.status(201).json(newMessage);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  updateMessage: async (req, res, next) => {
    const { user } = res.locals;
    const { content } = req.body;
    const { messageId } = req.params;

    try {
      const message = await mongoClient.message.findFirst({
        where: {
          AND: [
            { id: messageId },
            { authorId: user.id },
          ],
        },
      });

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      const updatedMessage = await mongoClient.message.update({
        where: { id: message.id },
        data: {
          content,
        },
      });

      return res.status(200).json(updatedMessage);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  deleteMessage: async (req, res, next) => {
    const { messageId } = req.params;

    try {
        const message = await mongoClient.message.findFirst({
            where: {
              AND: [
                { id: messageId },
                { authorId: user.id },
              ],
            },
          });
    
          if (!message) {
            return res.status(404).json({ message: 'Message not found' });
          }

        const deletedMessage = await mongoClient.message.update({
            where: { id: messageId },
            data: {
              deleted: true,
            },
          });

      return res.status(200).json(deletedMessage);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },
};
