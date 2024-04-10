import postgresClient from '../models/postgresClient.js';

export default {

  // obtenir les ids des conversations pour un user fournis
  // /api/me/teams

  getTeams: async (req, res, next) => {
    const { user } = res.locals;
    try {
      const userHasTeams = await postgresClient.user.findUnique({
        where: { id: user.id },
        include: { teams: true },
      });
      // Je ne garde que le tableau d'équipe pour le rendre au front
      const { teams } = userHasTeams;
      return res.json(teams);
    } catch (err) {
      return next({
        status: 500,
        message: 'Internal Server Error',
        error: err,
      });
    }
  },

  // Créer une équipe avec les utilisateurs fournis dedans
  // /api/me/teams

  // Obtenir les données d'une équipe (id fourni), inclure les utilisateurs qui la compose
  // /api/me/teams/:team-id

  // Modifier une équipe (id fourni)
  // /api/me/teams/:team-id

};
