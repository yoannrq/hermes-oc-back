import express from 'express';
import loginRequired from '../middlewares/loginRequired.js';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

/**
 * @swagger
 * /api/me/conversations:
 *   get:
 *     summary: Liste des conversations de l'utilisateur
 *     tags:
 *       - conversation
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
router.get('/', loginRequired, conversationController.getConversations);

export default router;
