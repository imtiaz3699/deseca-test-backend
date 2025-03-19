import Task from "../model/task.model.js";
import { apiErrorHandler, apiSuccessResponse } from "../utils/helpers.js";
import User from "../model/user.model.js";
export const addTask = async (req, res) => {
  const {
    title,
    description,
    status,
    assignedTo,
    createdBy,
    assignedBy,
    due_date,
  } = req.body;
  if (!title) {
    return apiErrorHandler(res, 400, "Please enter title");
  }
  if (!createdBy) {
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
      due_date,
    });
    await newTask.save();
    return apiSuccessResponse(res, "Task created successfully", newTask);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};

export const getTasks = async (req, res) => {
  const { status, startDate, endDate } = req.query;
  try {
    // tasks for user
    if (req?.user?.role === "user") {
      let query = { createdBy: req.user.id };
      if (status) {
        query.status = status;
      }
      const start = startDate && !isNaN(new Date(startDate).getTime()) ? new Date(startDate) : null;
      const end = endDate && !isNaN(new Date(endDate).getTime()) ? new Date(endDate) : null;
      if (start || end) {
        query.due_date = {};
        if (start) query.due_date.$gte = start;
        if (end) query.due_date.$lte = end;
      }
      const tasks = await Task.find(query)
        .populate("assignedTo createdBy assignedBy", "name email")
        .select("-password");
      return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
    }
    // task for manager
    if (req?.user?.role === "manager") {
      const managedUsers = await User.find({ managerId: req.user.id }).select("_id");
      const userIds = managedUsers.map(user => user._id);
      let query = { createdBy: { $in: userIds } };
      const { status, startDate, endDate } = req.query;
      if (status) {
        query.status = status;
      }
      const start = startDate && !isNaN(new Date(startDate).getTime()) ? new Date(startDate) : null;
      const end = endDate && !isNaN(new Date(endDate).getTime()) ? new Date(endDate) : null;
      if (start || end) {
        query.due_date = {};
        if (start) query.due_date.$gte = start;
        if (end) query.due_date.$lte = end;
      }
      const tasks = await Task.find(query)
        .populate("assignedTo createdBy assignedBy", "name email")
        .select("-password");
    
      return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
    }
    // all task for admin
    if (req?.user?.role === "admin") {
      const usersCreatedByAdmin = await User.find({
        createdBy: req.user.id,
      }).select("_id");
      const userIds = usersCreatedByAdmin.map((user) => user._id);
      let query = { createdBy: { $in: userIds } };
      const { status, startDate, endDate } = req.query;

      if (status) {
        query.status = status;
      }
      if (startDate || endDate) {
        const start =
          startDate && !isNaN(new Date(startDate).getTime())
            ? new Date(startDate)
            : null;
        const end =
          endDate && !isNaN(new Date(endDate).getTime())
            ? new Date(endDate)
            : null;

        if (start || end) {
          query.due_date = {};
          if (start) query.due_date.$gte = start;
          if (end) query.due_date.$lte = end;
        }
      }

      const tasks = await Task.find(query)
        .populate("assignedTo createdBy assignedBy", "name email")
        .select("-password");

      return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
    }
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error: ${e.message}`);
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
