import mongoClient from '../models/mongoClient.js';
import postgresClient from '../models/postgresClient.js';

export default {

  // obtenir les ids des conversations pour un user fournis
  // /api/me/teams

  getTeams: async (req, res, next) => {
    const { user } = res.locals;
    try {
      const teamsWithTeammates = await postgresClient.team.findMany({
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
            },
          },
        },
      });
      console.log('teamsWithTeammates: ', teamsWithTeammates);
      // on veut fournir le dernier message de chaque team
      // Commencons d'abord par récupérer le dernier message pour une team
      const lastMessage = await mongoClient.message.findFirst({
        where: {
          teamId: teamsWithTeammates.id,
        },
        orderBy: {
          id: 'desc', // Tri par ordre décroissant pour obtenir le dernier message
        },
      });

      // maintenant faisons en sorte de le récupérer pour toutes les teams
      const lastMessages = await mongoClient.message.findMany({

      });

      console.log('lastmessage: ', lastMessage);
      // on veut aussi fournir le nombre de message non lus pour chaque team

      return res.json(teamsWithTeammates);
    } catch (error) {
      return next({
        status: 500,
        message: 'Internal Server Error',
        error,
      });
    }
  },

  // Créer une équipe avec les utilisateurs fournis dans le body
  // /api/me/teams
  newTeam: async (req, res, next) => {
    const { user } = res.locals;
    const {
      teamName, teamColor, teamProfilePictureUrl,
    } = req.body;

    try {
      // if (!receiver) {
      //   return next({
      //     status: 404,
      //     message: 'Receiver not found',
      //   });
      // }

      const team = await postgresClient.team.create({
        data: {
          name: teamName,
          profilePictureUrl: teamProfilePictureUrl,
          color: teamColor,
          ownerId: user.id,
        },
      });
      console.log(team);
      return res.status(201).json(team);
    } catch (err) {
      return next({
        status: 400,
        message: 'Bad request',
        error: err,
      });
    }
  },
  // Obtenir les données d'une équipe (id fourni), inclure les utilisateurs qui la compose
  // /api/me/teams/:team-id

  getOneTeamWithMessages: async (req, res, next) => {
    const { user } = res.locals;
    const teamId = parseInt(req.params.id, 10);

    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    if (teamId.isNaN) {
      return next({
        status: 400,
        message: 'Invalidate parameter',
      });
    }

    try {
      const teamWithTeammates = await postgresClient.team.findFirst({
        where: {
          id: teamId,
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
          },
        },
      });
      if (!team) {
        return next({
          status: 404,
          message: 'Team not found',
        });
      }
      console.log('teamWithTeammates: ', teamWithTeammates);
      // maintenant on souhaite ajouter les messages à notre requête
      const teamMessages = ;
      return res.status(201).json(teamWithTeammates);
    } catch (error) {
      return next({
        status: 500,
        message: 'Internal Server Error',
        error,
      });
    }
  },

  // Modifier une équipe (id fourni)
  // /api/me/teams/:team-id

};

// trouver le dernier message de la conv (lastMessage)
// const lastMessage = await mongoClient.message.findFirst({
//   where: {
//     teamId: teamsWithTeammates[i].id,
//   },
//   orderBy: {
//     id: 'desc',
//   },
// });

// trouver le nombre de message non lu (unreadMessageCount)
