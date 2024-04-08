import express from 'express';
import meController from '../controllers/meController.js';

const router = express.Router();

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
 */
router.patch('/', meController.updateMe);

export default router;
