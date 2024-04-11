import express from 'express';
import messageController from '../controllers/messageController.js';

const router = express.Router();


/**
 * @swagger
 * /api/me/messages:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message.
 *               conversationId:
 *                 type: integer
 *                 description: The ID of the conversation to update the last message read, mutually exclusive with channelId and teamId.
 *               channelId:
 *                 type: integer
 *                 description: The ID of the channel to update the last message read, mutually exclusive with conversationId and teamId.
 *               teamId:
 *                 type: integer
 *                 description: The ID of the team to update the last message read, mutually exclusive with conversationId and channelId.
 *     responses:
 *       '201':
 *         description: New message created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/message'
 *       '400':
 *         description: Bad request (e.g., malformed request body)
 *       '401':
 *         description: Unauthorized (e.g., invalid or missing authentication token)
 *       '500':
 *         description: Internal server error (e.g., could not create the message due to server error)
 */
router.post('/', messageController.createMessage);

/**
 * @swagger
 * /api/me/messages/{messageId}:
 *   patch:
 *     summary: Update an existing message
 *     tags:
 *       - message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the message to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The new content of the message
 *     responses:
 *       '200':
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/message'
 *       '400':
 *         description: Bad request (e.g., malformed request body or invalid messageId)
 *       '401':
 *         description: Unauthorized (e.g., invalid or missing authentication token)
 *       '404':
 *         description: Message not found
 *       '500':
 *         description: Internal server error (e.g., could not update the message due to server error)
 */
router.patch('/:messageId', messageController.updateMessage);

/**
 * @swagger
 * /api/me/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags:
 *       - message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the message to delete
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *       '401':
 *         description: Unauthorized (e.g., invalid or missing authentication token)
 *       '404':
 *         description: Message not found
 *       '500':
 *         description: Internal server error (e.g., could not delete the message due to server error)
 */
router.delete('/:messageId', messageController.deleteMessage);

export default router;