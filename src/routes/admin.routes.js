import express from 'express';
import {addUser, assignManager, deleteTask, deleteUser, editUser, getAllUsers} from '../controller/admin.controller.js'
import { checkRole, verifyToken } from '../middleware/middleware.js';
const router = express.Router();
router.post("/add-user",verifyToken,checkRole(["admin"]),addUser);
router.post("/assign-manager",verifyToken,checkRole(["admin"]),assignManager);
router.get("/get-user",verifyToken,checkRole(["admin"]),getAllUsers);
router.put("/edit-user/:userId",verifyToken,checkRole(["admin"]),editUser);
router.delete("/delete-user/:userId", verifyToken, checkRole(["admin"]), deleteUser);
router.delete("/delete-task/:taskId", verifyToken, checkRole(["admin"]), deleteTask);
export default router;