const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.sendMessage = async (req, res) => {
  try {
    //fetch the details
    const { name, email, message } = req.body;

    //validate the details
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    //admins cannot send messages
    const user = await User.findOne({ email });

    //check is admin
    if (user && user.role === "Admin") {
      return res.status(400).json({
        success: false,
        message: "Admins cannot send messages.",
      });
    }

    //create new message
    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    //return response
    return res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//only admins can see messages
exports.getMessages = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found.",
      });
    }
    const messages = await Message.find({});
    return res.status(200).json({
      success: true,
      data: messages,
      message: "Messages data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
