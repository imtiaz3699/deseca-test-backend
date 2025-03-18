import mongoose from "mongoose";
import { apiErrorHandler, apiSuccessResponse } from "../utils/helpers.js";
import Task from "../model/task.model.js";
import User from "../model/user.model.js";
// export const updateTasks = async (req, res) => {};

// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find()
//       .populate("assignedTo createdBy assignedBy", "name email")
//       .select("-password");
//     return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
//   } catch (e) {
//     console.log(e);
//     return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
//   }
// };

// export const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ managerId: req.user._id })
//       .populate("assignedTo createdBy assignedBy", "name email")
//       .select("-password");
//     return apiSuccessResponse(res, "Tasks fetched successfully", tasks);
//   } catch (e) {
//     console.log(e);
//     return apiErrorHandler(res, 500, `Internal server error:${e.message}`);
//   }
// };

export const getTasksManager = async (req, res) => {
  try {
    const usersUnderManager = await User.find({
      managerId: { $ne: null, $eq: new mongoose.Types.ObjectId(req.user._id) },
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
