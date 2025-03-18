import User from "../model/user.model.js";
import { apiErrorHandler, apiSuccessResponse } from "../utils/helpers.js";
import bcrypt from "bcryptjs";

export const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return apiErrorHandler(res, 400, "Please enter all fields");

  if (!["manager", "user"].includes(role)) {
    return apiErrorHandler(res, 400, "Invalid role");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return apiErrorHandler(res, 400, "User already exists");
    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;
    return apiSuccessResponse(res, "User created successfully", userObj);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};

export const assignManager = async (req, res) => {
  const { userId, managerId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) apiErrorHandler(res, 404, "User not found");

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return apiErrorHandler(res, 400, "Invalid manager");
    }

    user.managerId = managerId;
    await user.save();
    return apiSuccessResponse(res, "Manager assigned successfully", user);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("managerId", "name email")
      .select("-password");
    return apiSuccessResponse(res, "Users fetched successfully", users);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};

export const editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );
    const userObj = updatedUser.toObject();
    delete userObj.password;
    if (!updatedUser) return apiSuccessResponse(res, "User not found");
    return apiSuccessResponse(res, "User updated successfully", userObj);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return apiErrorHandler(res, 404, "User not found");
    return apiSuccessResponse(res, "User deleted successfully",);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return apiErrorHandler(res, 404, "Task not found");
    return apiSuccessResponse(res, "Task deleted successfully", deletedTask);
  } catch (err) {
    console.log(err);
    return apiErrorHandler(res, 500, `Internal server error:${err.message}`);
  }
};
