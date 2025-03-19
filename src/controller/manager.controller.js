import mongoose from "mongoose";
import { apiErrorHandler, apiSuccessResponse } from "../utils/helpers.js";
import Task from "../model/task.model.js";
import User from "../model/user.model.js";

export const getTasksManager = async (req, res) => {
  try {
    const usersUnderManager = await User.find({
      managerId: { $ne: null, $eq: new mongoose.Types.ObjectId(req.user.id) },
    }).select("_id name email");
    const userIds = usersUnderManager.map((user) => user._id);
    const tasks = await Task.find({ createdBy: { $in: userIds } })
      .populate("assignedTo createdBy assignedBy", "name email")
      .select("-password");
    return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error: ${e.message}`);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ managerId: req.user._id })
      .populate("managerId", "name email")
      .select("-password");
    return apiSuccessResponse(res, "Users fetched successfully", users);
  } catch (e) {
    console.log(e);
    return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
  }
};

export const managerTasks = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = { createdBy: req.user.id };
    if (status) {
      query.status = status;
    }
    const start =
      startDate && !isNaN(new Date(startDate).getTime())
        ? new Date(startDate)
        : null;
    const end =
      endDate && !isNaN(new Date(endDate).getTime()) ? new Date(endDate) : null;
    if (start || end) {
      query.due_date = {};
      if (start) query.due_date.$gte = start;
      if (end) query.due_date.$lte = end;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo createdBy assignedBy", "name email")
      .select("-password");

    return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
  } catch (e) {
    console.error("Error fetching manager tasks:", e);
    return apiErrorHandler(res, 500, "Internal server error");
  }
};
