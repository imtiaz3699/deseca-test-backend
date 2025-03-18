import express from 'express';
import { getTasksManager, getUsers } from '../controller/manager.controller.js';
import { verifyToken,checkRole } from '../middleware/middleware.js';
const router = express.Router();

router.get("/get-task",verifyToken,checkRole(["manager"]),getTasksManager)
router.get("/get-user",getUsers)

export default router;