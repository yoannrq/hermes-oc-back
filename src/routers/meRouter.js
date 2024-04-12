import express from 'express';
import meController from '../controllers/meController.js';

import conversationRouter from './conversationRouter.js';
import messageRouter from './messageRouter.js';
import patientRouter from './patientRouter.js';

const router = express.Router();

// Routes conversations
router.use('/conversations', conversationRouter);

// Routes messages
router.use('/messages', messageRouter);

// Routes patients
router.use('/patients', patientRouter);

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Retrieve user informations
 *     tags:
 *       - me
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User informations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       401:
 *         description: Unauthorized.
 *       500:
 *       description: Internal server error.
 */
router.get('/', meController.getMe);

/**
 * @swagger
 * /api/me:
 *   patch:
 *     summary: Update user informations
 *     tags:
 *       - me
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: Updated user informations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       401:
 *         description: Unauthorized.
 *       500:
 *        description: Internal server error.
 */
router.patch('/', meController.updateMe);

/**
 * @swagger
 * /api/me/last-message-read:
 *   patch:
 *     summary: Update the last message read for a user in a conversation, channel, or team
 *     description: |
 *       Updates the last read message for a user, specifying only one of conversationId, channelId, or teamId.
 *       These three parameters are mutually exclusive – only one of them should be provided.
 *     tags:
 *       - me
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *                 description: The ID of the last message that has been read.
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
 *       200:
 *         description: Last message read updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Last message read updated'
 *       400:
 *         description: Bad request - missing or incorrect parameters.
 *       401:
 *         description: Unauthorized.
 *       500:
 *        description: Internal server error.
 */
router.patch('/last-message-read', meController.updateLastMessageRead);

export default router;
