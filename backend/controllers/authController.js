const Joi = require("joi");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const BloodBank = require("../models/BloodBank");
const { generateToken } = require("../utils/generateToken");
const { USER_ROLES, BLOOD_GROUPS } = require("../utils/constants");

// Joi validation schemas
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...USER_ROLES).default("donor"),
  phone: Joi.string().trim().allow("", null),
  // Optional profile fields when registering along with a specific role
  bloodGroup: Joi.string().valid(...BLOOD_GROUPS).when("role", { is: "donor", then: Joi.optional() }),
  address: Joi.string().allow("", null),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password, role, phone, bloodGroup, address, location } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists"
      });
    }

    let donorProfileId = null;
    let hospitalProfileId = null;
    let bloodBankProfileId = null;

    // Auto-create linked profile if relevant fields are present
    if (role === "donor" && bloodGroup && location) {
      const donor = await Donor.create({
        name,
        bloodGroup,
        phone,
        location,
        eligible: true,
        available: true
      });
      donorProfileId = donor._id;
    } else if (role === "hospital" && address && location) {
      const hospital = await Hospital.create({
        name,
        address,
        phone: phone || "Not Provided",
        email,
        location
      });
      hospitalProfileId = hospital._id;
    } else if (role === "bloodbank" && address && location) {
      const bloodBank = await BloodBank.create({
        name,
        address,
        phone: phone || "Not Provided",
        location
      });
      bloodBankProfileId = bloodBank._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "donor",
      phone,
      donorProfileId,
      hospitalProfileId,
      bloodBankProfileId
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    // Explicitly select password as it is excluded by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("donorProfileId")
      .populate("hospitalProfileId")
      .populate("bloodBankProfileId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
