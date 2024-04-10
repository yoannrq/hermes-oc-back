import express from 'express';
import conversationController from '../controllers/conversationController.js';
import validateParams from '../middlewares/validateParams.js';

import permissionRequired from '../middlewares/permissionRequired.js';
import permissions from '../utils/permissions/permissions.js';
import permissionService from '../utils/permissions/permissionService.js';

const router = express.Router();

router.use(permissionRequired(permissions.conversation.all.canRead));

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
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Receiver not found
 */
router.post('/', loginRequired, conversationController.newConversation);

/**
 * @swagger
 * /api/me/conversations/{conversationId}/messages:
 *   get:
 *     summary: Retrieve a conversation with its messages
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
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Conversation not found
 */
router.get('/:conversationId/messages', loginRequired, validateParams, conversationController.getOneConversationWithMessages);

export default router;
