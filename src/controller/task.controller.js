import Task from "../model/task.model.js";
import { apiErrorHandler,apiSuccessResponse } from "../utils/helpers.js";

export const addTask = async (req, res) => {
  const { title, description, status, assignedTo, createdBy,assignedBy } = req.body;
  if (!title) {
    return apiErrorHandler(res, 400, "Please enter title");
  }
  if(!createdBy) {
    return apiErrorHandler(res, 400, "Please enter createdBy");
  }
  try {
    const newTask = new Task({
      title,
      description,
      status,
      assignedTo,
      assignedBy,
      createdBy,
    });
    await newTask.save();
    return apiSuccessResponse(res, "Task created successfully", newTask);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo createdBy assignedBy", "name email")
      .select("-password");
    return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    return apiSuccessResponse(res, "Task updated successfully", task);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return apiErrorHandler(res, 404, "Task not found");
    return apiSuccessResponse(res, "Task deleted successfully", deletedTask);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};