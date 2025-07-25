import User from "../models/user.model.js";
import Address from "../models/address.model.js";

export const addAddress = async (req, res) => {
  try {
    
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    //fetch the address details
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All address fields (first name, last name, email, phone, street, city, state, zipcode, country) are required.",
      });
    }

    //check for existing address
    const existingAddress = await Address.findOne({
      user: userId,
      street: street,
      zipcode: zipcode,
    });

    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message:
          "You've already saved this address. Please add a different one.",
      });
    }

    const newAddress = await Address.create({
      user: userId,
      firstName,
      lastName,
      phone,
      email,
      city,
      zipcode,
      street,
      state,
      country,
    });

    return res.status(201).json({
      success: true,
      data: newAddress,
      message: "Address added successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const savedAddresses = await Address.find({ user: userId });
    return res.status(200).json({
      success: true,
      data: savedAddresses,
      message: "Address data fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const viewAddress = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    const { id: addressId } = req.params;
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found with the provided id.",
      });
    }

    return res.status(200).json({
      success: true,
      data: address,
      message: "Address data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    const { id: addressId } = req.params;
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found with the provided id.",
      });
    }

    if (address.user.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Not authorized to delete this address.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    } = req.body;

    address.firstName = firstName || address.firstName;
    address.lastName = lastName || address.lastName;
    address.email = email || address.email;
    address.phone = phone || address.phone;
    address.city = city || address.city;
    address.street = street || address.street;
    address.state = state || address.state;
    address.zipcode = zipcode || address.zipcode;
    address.country = country || address.country;

    await address.save();

    return res.status(200).json({
      success: true,
      data: address,
      message: "Address updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    //authenticate user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const { id: addressId } = req.params;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found with the provided id.",
      });
    }

    if (address.user.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Not authorized to delete this address.",
      });
    }

    await address.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Added deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
