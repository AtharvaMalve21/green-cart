const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    //fetch user details
    const { name, email, password, gender, phone, role, city, country } =
      req.body;

    //validate user details
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !phone ||
      !role ||
      !city ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required details",
      });
    }

    const profilePic = req.file?.path;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "User Profile Avatar is required",
      });
    }

    //validate user phone number
    if (phone.length != 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be of 10 digits.",
      });
    }

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is registered with this email.",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
      profilePic,
      role,
      city,
      country,
    });

    //generate cookie
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });

    return res.status(201).json({
      success: true,
      data: newUser,
      message: "User is successfully registered.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists with this email.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password. Try again.",
      });
    }

    //generate cookie
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: "User is successfully logged in.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "User is successfully logged out.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User profile data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
