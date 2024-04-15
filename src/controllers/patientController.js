import postgresClient from '../models/postgresClient.js';
import messageService from '../services/message/messageService.js';
import getDateFromMongoObject from '../utils/formatingFunctions/getDateFromMongoObject.js';
import patientSchema from '../utils/validation/patientSchema.js';
import formatingName from '../utils/formatingFunctions/formatingName.js';
import userSchema from '../utils/validation/userSchema.js';

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
        channels: true,
      },
    });

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

  async createPatient(req, res, next) {
    const { user } = res.locals;
    const { success, data, error } = patientSchema.safeParse(req.body);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    const {
      firstname, lastname, birthdate, socialSecurityNumber, phoneNumber, email, address, zipCodeId,
    } = data;

    // Vérification si le mail ou le numéro de sécurité social existe déjà en BDD
    const patient = await postgresClient.patient.findFirst({
      where: {
        OR: [{ email }, { socialSecurityNumber }],
      },
    });

    if (patient) {
      return next({
        status: 409,
        message: 'Patient already exists.',
        email,
        socialSecurityNumber,
      });
    }

    const formatedFirstname = formatingName(firstname);
    const formatedLastname = formatingName(lastname);
    const formatedBirthdate = new Date(birthdate);

    const newPatient = await postgresClient.patient.create({
      data: {
        firstname: formatedFirstname,
        lastname: formatedLastname,
        birthdate: formatedBirthdate,
        socialSecurityNumber,
        phoneNumber,
        email,
        address,
        zipCodeId: parseInt(zipCodeId, 10),
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res.status(201).json(newPatient);
  },

  async getPatientWithChannels(req, res, next) {
    const { user } = res.locals;
    const { patientId } = req.params;

    const patient = await postgresClient.patient.findFirst({
      where: {
        id: parseInt(patientId, 10),
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

    if (!patient) {
      return next({
        status: 404,
        message: 'Patient not found or this current user is not associated with this patient.',
      });
    }

    const channelsWithLastMessage = await Promise.all(
      patient.channels.map(async (channel) => {
        const roomInfo = await messageService.getRoomInfo({
          roomType: 'channel',
          roomId: channel.id,
          userId: user.id,
        });
        return {
          ...channel,
          ...roomInfo,
        };
      }),
    );

    return res.status(200).json({ ...patient, channels: channelsWithLastMessage });
  },

  async getPatientWithUsers(req, res, next) {
    const { user } = res.locals;
    const { patientId } = req.params;

    const patient = await postgresClient.patient.findFirst({
      where: {
        id: parseInt(patientId, 10),
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
            firstname: true,
            lastname: true,
            email: true,
            rppsCode: true,
            profilePictureUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!patient) {
      return next({
        status: 404,
        message: 'Patient not found or this current user is not associated with this patient.',
      });
    }

    return res.status(200).json(patient);
  },

  async addUserToPatient(req, res, next) {
    const { patientId } = req.params;

    const { success, data, error } = userSchema.partial().safeParse(req.body);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    const { email, rppsCode } = data;

    if (email && rppsCode) {
      return next({
        status: 400,
        message: 'You must provide either an email or an RPPS code, not both.',
      });
    }

    const userToAdd = await postgresClient.user.findFirst({
      where: {
        OR: [{ email }, { rppsCode }],
      },
    });

    if (!userToAdd) {
      return next({
        status: 404,
        message: 'User not found.',
      });
    }

    const updatedPatient = await postgresClient.patient.update({
      where: {
        id: parseInt(patientId, 10),
      },
      data: {
        users: {
          connect: {
            id: userToAdd.id,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return res.status(200).json(updatedPatient);
  },

  async removeUserFromPatient(req, res, next) {
    const { patientId } = req.params;

    const { success, data, error } = userSchema.partial().safeParse(req.body);

    if (!success) {
      // erreur de validation de schéma zod !
      return next({
        status: 400,
        message: 'Schema validation error.',
        errors: error.errors,
      });
    }

    const { email, rppsCode } = data;

    if (email && rppsCode) {
      return next({
        status: 400,
        message: 'You must provide either an email or an RPPS code, not both.',
      });
    }

    const userToRemove = await postgresClient.user.findFirst({
      where: {
        OR: [{ email }, { rppsCode }],
      },
    });

    if (!userToRemove) {
      return next({
        status: 404,
        message: 'User not found.',
      });
    }

    const updatedPatient = await postgresClient.patient.update({
      where: {
        id: parseInt(patientId, 10),
      },
      data: {
        users: {
          disconnect: {
            id: parseInt(userToRemove.id, 10),
          },
        },
      },
      include: {
        users: true,
      },
    });

    return res.status(200).json(updatedPatient);
  },
};
