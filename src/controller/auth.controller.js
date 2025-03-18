import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { apiSuccessResponse, apiErrorHandler } from "../utils/helpers.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return apiErrorHandler(res, 400, "Please enter all fields");
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return apiErrorHandler(res, 400, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return apiErrorHandler(res, 400, "Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    const userObj = user.toObject();
    delete userObj.password;
    return apiSuccessResponse(res, "Login successful", {
      token,
      user: userObj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
