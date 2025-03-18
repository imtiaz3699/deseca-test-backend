import express from 'express';
import { addTask,updateTask,getTasks,deleteTask } from '../controller/task.controller.js';
// import { deleteTask } from '../controller/admin.controller.js';

const router = express.Router();

router.post('/add-task', addTask);
router.put('/update-task/:id', updateTask);
router.get('/get-tasks', getTasks);
router.delete('/delete-tasks/:id', deleteTask);

export default router;