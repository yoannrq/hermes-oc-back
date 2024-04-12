import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/me/patients:
 *   get:
 *     summary: Retrieve a list of patients with their last message details
 *     tags:
 *       - patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   birthdate:
 *                     type: string
 *                     format: date-time
 *                   socialSecurityNumber:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   lastMessage:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       sourceMessageId:
 *                         type: string
 *                         nullable: true
 *                       content:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       deleted:
 *                         type: boolean
 *                       authorId:
 *                         type: integer
 *                       conversationId:
 *                         type: integer
 *                         nullable: true
 *                       teamId:
 *                         type: integer
 *                         nullable: true
 *                       channelId:
 *                         type: integer
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Patients not found
 *       '500':
 *         description: Internal server error
 */
router.get('/', patientController.getPatients);

export default router;
