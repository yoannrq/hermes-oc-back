import bcrypt from 'bcrypt';
import postgresClient from '../models/postgresClient.js';
import userSchema from '../utils/validation/userSchema.js';
import formatingName from '../utils/formatingFunctions/formatingName.js';
import mongoClient from '../models/mongoClient.js';

export default {
  async getMe(req, res) {
    // Reconstitution de l'objet user pour formater les données roles
    const user = {
      ...res.locals.user,
      roles: res.locals.user.roles.map((userHasRole) => userHasRole.role),
    };

    return res.status(200).json(user);
  },

  async updateMe(req, res, next) {
    const { success, data, error } = userSchema.partial().safeParse(req.body);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.firstname) {
      data.firstname = formatingName(data.firstname);
    }

    if (data.lastname) {
      data.lastname = formatingName(data.lastname);
    }

    const { user } = res.locals;

    try {
      const updatedUser = await postgresClient.user.update({
        where: { id: user.id },
        data,
      });

      delete updatedUser.password;

      res.locals.user = updatedUser;

      return res.status(200).json(updatedUser);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },

  updateLastMessageRead: async (req, res, next) => {
    const { user } = res.locals;

    // Todo: Check user input with zod
    const { conversationId, channelId, teamId, messageId } = req.body;

    if (!messageId) {
      return res.status(200).json({ message: 'No messages' });
    }

    if ((conversationId && channelId) || (conversationId && teamId) || (channelId && teamId)) {
      return next({
        status: 400,
        message: 'You must provide only one of conversationId, channelId or teamId',
      });
    }

    let entryType;
    let entryId;

    if (conversationId) {
      entryType = 'conversationId';
      entryId = parseInt(conversationId, 10);
    } else if (channelId) {
      entryType = 'channelId';
      entryId = parseInt(channelId, 10);
    } else if (teamId) {
      entryType = 'teamId';
      entryId = parseInt(teamId, 10);
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Missing conversationId, channelId, or teamId',
      });
    }

    try {
      const lastMessageRead = await mongoClient.lastMessageRead.findFirst({
        where: {
          AND: [{ readerId: parseInt(user.id, 10) }, { [entryType]: entryId }],
        },
      });

      if (lastMessageRead) {
        await mongoClient.lastMessageRead.update({
          where: { id: lastMessageRead.id },
          data: {
            messageId,
          },
        });
      } else {
        await mongoClient.lastMessageRead.create({
          data: {
            messageId,
            readerId: parseInt(user.id, 10),
            [entryType]: entryId,
          },
        });
      }

      return res.status(200).json({ message: 'Last message read updated' });
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    }
  },
};
