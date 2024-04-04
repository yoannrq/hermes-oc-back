import express from 'express';
import authRouter from './authRouter.js';
import meRouter from './meRouter.js';
import loginRequired from '../middlewares/loginRequired.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Routes d'authentification
router.use('/api/auth', authRouter);

// Routes me
router.use('/api/me', loginRequired, meRouter);

export default router;
