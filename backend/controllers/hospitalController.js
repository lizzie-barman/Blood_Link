const Joi = require("joi");
const Hospital = require("../models/Hospital");
const EmergencyRequest = require("../models/EmergencyRequest");
const { findMatchingDonors } = require("../services/donorMatching");
const { notifyNewEmergencyRequest } = require("../services/notificationService");
const { BLOOD_GROUPS, BLOOD_COMPONENTS, URGENCY_LEVELS } = require("../utils/constants");

const hospitalSchema = Joi.object({
  name: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  email: Joi.string().trim().email().allow("", null),
  emergencyContact: Joi.string().trim().allow("", null),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required()
});

const emergencyRequestSchema = Joi.object({
  hospitalId: Joi.string().allow("", null),
  hospitalName: Joi.string().trim().required(),
  hospitalPhone: Joi.string().trim().allow("", null),
  bloodGroup: Joi.string().valid(...BLOOD_GROUPS).required(),
  component: Joi.string().valid(...BLOOD_COMPONENTS).required(),
  unitsRequired: Joi.number().integer().min(1).required(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required(),
  urgency: Joi.string().valid(...URGENCY_LEVELS).default("URGENT"),
  radius: Joi.number().positive().default(10)
});

/**
 * @route   POST /api/hospitals
 * @desc    Create/Register a new hospital
 * @access  Public / Authenticated
 */
const createHospital = async (req, res, next) => {
  try {
    const { error, value } = hospitalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const hospitalData = {
      ...value,
      userId: req.user ? req.user._id : null
    };

    const hospital = await Hospital.create(hospitalData);

    res.status(201).json({
      success: true,
      hospital
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/hospitals
 * @desc    Get all registered hospitals
 * @access  Public
 */
const getHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json({
      success: true,
      count: hospitals.length,
      hospitals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/hospitals/:id
 * @desc    Get single hospital by ID
 * @access  Public
 */
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    res.json({
      success: true,
      hospital
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/hospitals/:id
 * @desc    Update hospital details
 * @access  Private / Hospital Owner or Admin
 */
const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    res.json({
      success: true,
      hospital
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/hospitals/request
 * @desc    Create an emergency blood request on behalf of a hospital
 * @access  Public / Authenticated
 */
const createHospitalRequest = async (req, res, next) => {
  try {
    const { error, value } = emergencyRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const {
      hospitalName,
      hospitalPhone,
      bloodGroup,
      component,
      unitsRequired,
      location,
      urgency,
      radius
    } = value;

    const request = await EmergencyRequest.create({
      hospitalName,
      hospitalPhone,
      bloodGroup,
      component,
      unitsRequired,
      location,
      urgency: urgency || "URGENT"
    });

    const matches = await findMatchingDonors(
      bloodGroup,
      location.lat,
      location.lng,
      radius || 10
    );

    const matchedDonors = matches.map((item) => ({
      donorId: item.donor._id,
      name: item.donor.name,
      bloodGroup: item.donor.bloodGroup,
      phone: item.donor.phone,
      distance: Number(item.distance.toFixed(2)),
      matchReason: item.matchReason
    }));

    request.notifiedDonorIds = matches.map((item) => item.donor._id);
    await request.save();

    // Centralized real-time notification
    notifyNewEmergencyRequest(request, matches);

    res.status(201).json({
      success: true,
      request,
      matchedDonors,
      matching: {
        radiusKm: radius || 10,
        totalEligibleNearbyDonors: matches.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/hospitals/:id/requests
 * @desc    Get all emergency requests created by/for a hospital
 * @access  Public / Authenticated
 */
const getHospitalRequests = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    const query = {};
    if (hospital) {
      query.hospitalName = hospital.name;
    }

    const requests = await EmergencyRequest.find(query)
      .populate("matchedDonorId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  createHospitalRequest,
  getHospitalRequests
};
