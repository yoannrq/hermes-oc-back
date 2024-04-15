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
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   zipCodeId:
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
 *                   channels:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         patientId:
 *                           type: integer
 *                         channelTypeId:
 *                           type: integer
 *                   lastMessage:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       channelId:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       authorId:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                   unreadMessagesCount:
 *                     type: integer
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Patients not found
 *       '500':
 *         description: Internal server error
 */
router.get('/', patientController.getPatients);

/**
 * @swagger
 * /api/me/patients:
 *   post:
 *     summary: Create a new patient
 *     tags:
 *       - patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/patient'
 *     responses:
 *       '201':
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/patient'
 *       '401':
 *         description: Unauthorized access.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', patientController.createPatient);

/**
 * @swagger
 * /api/me/patients/{patientId}/channels:
 *   get:
 *     summary: Get a patient with their associated channels
 *     tags:
 *       - patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 zipCodeId:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 birthdate:
 *                   type: string
 *                   format: date-time
 *                 socialSecurityNumber:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 channels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       patientId:
 *                         type: integer
 *                       channelTypeId:
 *                         type: integer
 *                       channelType:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           color:
 *                             type: string
 *                           order:
 *                             type: integer
 *                       lastMessage:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           channelId:
 *                             type: integer
 *                           content:
 *                             type: string
 *                           authorId:
 *                             type: integer
 *                       unreadMessagesCount:
 *                         type: integer
 *                       totalMessages:
 *                         type: integer
 *       '401':
 *         description: Unauthorized access.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:patientId/channels', patientController.getPatientWithChannels);

export default router;
