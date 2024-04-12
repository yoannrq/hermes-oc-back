import express from 'express';
import conversationController from '../controllers/conversationController.js';

// import permissionRequired from '../middlewares/permissionRequired.js';
// import permissions from '../utils/permissions/permissions.js';

const router = express.Router();

/* router.use(
  permissionRequired(permissions.conversation.all.canReadConversation),
); */

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
 *         description: User conversations with the last message, unread message count, and total message count
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
 *                         format: uri
 *                         description: The URL to the user's profile picture
 *                   lastMessage:
 *                     $ref: '#/components/schemas/message'
 *                     description: The last message in the conversation
 *                   unreadMessagesCount:
 *                     type: integer
 *                     description: The count of unread messages in the conversation
 *                   totalMessages:
 *                     type: integer
 *                     description: The total number of messages in the conversation
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/', conversationController.getConversations);

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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Receiver not found
 *       500:
 *        description: Internal server error
 */
router.post('/', conversationController.newConversation);

export default router;
