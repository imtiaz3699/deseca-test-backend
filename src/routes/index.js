import express from 'express';
import authRoutes from './auth.routes.js'
import adminRoutes from './admin.routes.js'
import taskRoutes from './task.routes.js'
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/task', taskRoutes);

export default router;