import express from 'express';
import loginRequired from '../middlewares/loginRequired.js';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

/**
 * @swagger
 * /api/me/conversations:
 *   get:
 *     summary: List of user conversations
 *     tags:
 *       - conversation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User conversations with the last message and unread message count
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   conversationid:
 *                     type: integer
 *                     description: The unique identifier of the conversation
 *                   receiver:
 *                     type: object
 *                     description: Information about the other user in the conversation
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the user
 *                       email:
 *                         type: string
 *                         description: The email address of the user
 *                       firstname:
 *                         type: string
 *                         description: The first name of the user
 *                       lastname:
 *                         type: string
 *                         description: The last name of the user
 *                       profilePictureUrl:
 *                         type: string
 *                         description: The URL to the user's profile picture
 *                   lastMessage:
 *                     $ref: '#/components/schemas/message'
 *                     description: The last message in the conversation
 *                   unreadMessagesCount:
 *                     type: integer
 *                     description: The count of unread messages in the conversation
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
router.get('/', loginRequired, conversationController.getConversations);

/**
 * @swagger
 * /api/me/conversations:
 *   post:
 *     summary: New conversation
 *     tags:
 *       - conversation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverEmail:
 *                 type: string
 *     responses:
 *       '201':
 *         description: New conversation created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/message'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Receiver not found
 */
router.post('/', loginRequired, conversationController.newConversation);

export default router;
