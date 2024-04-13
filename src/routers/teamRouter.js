import express from 'express';
import loginRequired from '../middlewares/loginRequired.js';
import teamController from '../controllers/teamController.js';

const router = express.Router();

/**
 * @swagger
 * /api/me/teams:
 *   get:
 *     summary: Liste des équipes pour un utilisateur.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Equipe de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   receiver:
 *                     type: string
 *       '401':
 *         description: Non autorisé
 *       '404':
 *         description: Utilisateur non trouvé
 */

router.get('/', loginRequired, teamController.getTeams);
router.post('/', loginRequired, teamController.newTeam);
router.get('/:id', loginRequired, teamController.getOneTeam);
router.patch('/:id', loginRequired, teamController.updateTeam);
router.get('/:id/users', loginRequired, teamController.getTeammates);
router.post('/:teamId/users/:userId', loginRequired, teamController.addTeammate);
router.delete('/:teamId/users/:userId', loginRequired, teamController.removeTeammate);

export default router;
