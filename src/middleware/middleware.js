import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(403).json({ message: "Access Denied" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log(verified)
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    res.status(400).json({ message: "Invalid Token", error: error.message });
  }
};

export const checkRole = (roles) => (req, res, next) => {
  console.log(req.user.role,roles);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
