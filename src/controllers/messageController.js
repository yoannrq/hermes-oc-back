import postgresClient from '../models/postgresClient.js';
import mongoClient from '../models/mongoClient.js';
import getTimestampFromMongoObject from '../utils/formatingFunctions/getTimestampFromMongoObject.js';
import canAccessRoom from '../utils/canAccessRoom.js';
import getObjectIdFromTimestamp from '../utils/formatingFunctions/getObjectIdFromTimestamp.js';

export default {
  createMessage: async (req, res, next) => {
    const { user } = res.locals;
    const {
      conversationId, channelId, teamId, content,
    } = req.body;

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
              {
                users:
              {
                some:
                { email: user.email },
              },
              },
            ],
          },
        });

        if (!isAssociatedWithPatient) {
          return res.status(403).json({ message: 'This user is not associated with the patient' });
        }
      } else if (teamId) {
        entryType = 'teamId';
        entryId = parseInt(teamId, 10);

        // Vérification que l'utilisateur est bien membre de l'équipe
        const isInTeam = await postgresClient.team.findFirst({
          where: {
            AND: [
              { id: entryId },
              {
                users:
              {
                some:
                { email: user.email },
              },
              },
            ],
          },
        });

        if (!isInTeam) {
          return res.status(403).json({ message: 'Not member of the team' });
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
          data: { messageId: newMessage.id },
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
        data: { content },
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
    const { user } = res.locals;

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
        data: { deleted: true },
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

  getOneRoomWithMessages: async (req, res, next) => {
    const { user } = res.locals;
    const roomId = parseInt(req.params.roomId, 10);
    const { roomType } = req.params;

    // Définition du timestamp d'origine à partir de la requête, ou utilisation du timestamp actuel si non fourni
    const originTimestamp = req.query.originTime ? req.query.originTime : new Date().toISOString();
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    if (roomId.isNaN) {
      return next({
        status: 400,
        message: 'Invalidate parameter',
      });
    }

    try {
      // Vérification si l'utilisateur fait partie de la room
      const canAccesRessource = await canAccessRoom(user.id, roomType, roomId);

      if (!canAccesRessource) {
        return res.status(403).json({ message: 'You do not have access to this resource' });
      }

      const rowSelector = `${roomType}Id`;

      const totalMessages = await mongoClient.message.count({ where: { [rowSelector]: roomId } });

      // Calcul du nombre total de pages pour la pagination
      const totalPages = Math.ceil(totalMessages / pageSize);

      // Calcul de l'offset pour servir les messages de la page demandée
      const offset = (page - 1) * pageSize;

      // Conversion du timestamp en ObjectId pour la requête MongoDB
      const originObjectId = getObjectIdFromTimestamp(originTimestamp);

      // Récupération des messages, filtrés par roomId et par ObjectId inférieur à celui calculé
      const messages = await mongoClient.message.findMany({
        where: {
          AND: [
            { [rowSelector]: roomId },
            { id: { lt: originObjectId } },
          ],
        },
        orderBy: { id: 'asc' },
        skip: offset,
        take: pageSize,
      });

      const formatedMessages = messages.map((message) => {
        // Vérifier si le message est soft-delete avant de retourner l'objet
        const content = message.deleted ? 'This message has been deleted' : message.content;

        return {
          id: message.id,
          content,
          date: getTimestampFromMongoObject(message),
          authorId: message.authorId,
        };
      });

      return res.status(200).json({
        roomType,
        roomId,
        messages: formatedMessages,
        pagination: {
          page,
          pageSize,
          totalMessages,
          totalPages,
          originTimestamp,
        },
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
