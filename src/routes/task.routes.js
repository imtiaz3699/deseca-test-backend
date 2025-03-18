import express from 'express';
import { addTask,updateTask,getTasks } from '../controller/task.controller.js';
import { deleteTask } from '../controller/admin.controller.js';

const router = express.Router();

router.post('/add-task', addTask);
router.post('/update-task/:id', updateTask);
router.post('/get-tasks', getTasks);
router.post('/delete-tasks/:id', deleteTask);

export default router;