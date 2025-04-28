const express = require("express");
const router = express.Router();
const { upload } = require("../utils/fileUpload");

const {
  signup,
  login,
  logout,
  getUserProfile,
} = require("../controllers/userController");

const { isAuthenticated } = require("../middleware/auth");

//Register User
router.post("/signup", upload.single("profilePic"), signup);

//Login User
router.post("/login", login);

//Logout User
router.get("/logout", isAuthenticated, logout);

//Get User Profile
router.get("/profile", isAuthenticated, getUserProfile);

module.exports = router;
