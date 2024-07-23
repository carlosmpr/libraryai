import express from 'express';
import userInstructionsRoutes from './userInstructionsRoutes.mjs';
import repositoryHandlerRoutes from './repositoryHandlerRoutes.mjs';

const router = express.Router();

// Use the routes from userInstructionsRoutes and repositoryHandlerRoutes
router.use(userInstructionsRoutes);
router.use(repositoryHandlerRoutes);

export default router;
