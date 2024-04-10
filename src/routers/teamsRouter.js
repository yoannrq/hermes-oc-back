import express from 'express';
import loginRequired from '../middlewares/loginRequired.js';
import teamsController from '../controllers/teamsController.js';

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
 *         description: Conversations de l'utilisateur
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

router.get('/', loginRequired, teamsController.getTeams);

export default router;
