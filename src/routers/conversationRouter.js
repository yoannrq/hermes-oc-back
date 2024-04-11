import express from 'express';
import conversationController from '../controllers/conversationController.js';

import permissionRequired from '../middlewares/permissionRequired.js';
import permissions from '../utils/permissions/permissions.js';

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

/**
 * @swagger
 * /api/me/conversations/{conversationId}/messages:
 *   get:
 *     summary: Retrieve a conversation with its messages, supporting pagination
 *     tags:
 *       - conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the conversation to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the message list
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of messages per page
 *     responses:
 *       '200':
 *         description: Conversation with messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversationId:
 *                   type: integer
 *                 receiver:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     profilePictureUrl:
 *                       type: string
 *                       format: uri
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       authorId:
 *                         type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalMessages:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 *       500:
 *       description: Internal server error
 */
router.get(
  '/:conversationId/messages',
  conversationController.getOneConversationWithMessages,
);

export default router;
