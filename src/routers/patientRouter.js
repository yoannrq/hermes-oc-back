import express from 'express';
import patientController from '../controllers/patientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/me/patients:
 *   get:
 *     summary: Retrieve a list of patients with their associated channels
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
 *                   channels:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         color:
 *                           type: string
 *                           format: color
 *                         order:
 *                           type: integer
 *                         lastMessage:
 *                           type: object
 *                           properties:
 *                             content:
 *                               type: string
 *                             date:
 *                               type: string
 *                               format: date-time
 *                         unreadMessagesCount:
 *                           type: integer
 *                         totalMessages:
 *                           type: integer
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Patients not found
 *       '500':
 *         description: Internal server error
 */
router.get('/', patientController.getPatients);

export default router;
