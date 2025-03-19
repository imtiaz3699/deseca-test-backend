import express from 'express';
import { addTask,updateTask,getTasks,deleteTask } from '../controller/task.controller.js';
import { verifyToken } from '../middleware/middleware.js';
const router = express.Router();

router.post('/add-task', verifyToken, addTask);
router.put('/update-task/:id', verifyToken, updateTask);
router.get('/get-tasks', verifyToken, getTasks);
router.delete('/delete-tasks/:id',verifyToken, deleteTask);

export default router;