const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated. Login Again.",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated. Login Again.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isAuthorized = (...roles) => {
  return async function (req, res, next) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No User found. Login Again.",
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this route",
        });
      }
      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};
