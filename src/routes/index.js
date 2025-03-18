import express from 'express';
import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import taskRoutes from './task.routes.js'
import managerRoutes from './manager.routes.js'
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/task', taskRoutes);
router.use('/manager', managerRoutes);

export default router;