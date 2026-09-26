const Joi = require("joi");
const Donor = require("../models/Donor");
const { calculateEligibility } = require("../services/donorEligibility");
const { getDonorBadge, BLOOD_GROUPS } = require("../utils/constants");

const donorSchema = Joi.object({
  name: Joi.string().trim().required(),
  bloodGroup: Joi.string().valid(...BLOOD_GROUPS).required(),
  phone: Joi.string().trim().allow("", null),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required(),
  lastDonationDate: Joi.date().iso().allow(null, "")
});

/**
 * @route   POST /api/donors
 * @route   POST /api/donors/register
 * @desc    Register a new donor
 * @access  Public
 */
const createDonor = async (req, res, next) => {
  try {
    const { error, value } = donorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, bloodGroup, phone, location, lastDonationDate } = value;

    const eligibility = calculateEligibility(lastDonationDate);

    const donor = await Donor.create({
      name,
      bloodGroup,
      phone,
      location,
      lastDonationDate: lastDonationDate || null,
      eligible: eligibility.eligible,
      available: eligibility.eligible
    });

    res.status(201).json({
      success: true,
      donor,
      eligibility,
      badge: getDonorBadge(donor.donationCount)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/donors
 * @desc    Get all donors with real-time eligibility
 * @access  Public / Authenticated
 */
const getDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });

    const result = donors.map((donor) => {
      const eligibility = calculateEligibility(donor.lastDonationDate);

      return {
        ...donor.toObject(),
        eligible: eligibility.eligible,
        daysSinceDonation: eligibility.daysSinceDonation,
        daysRemaining: eligibility.daysRemaining,
        badge: getDonorBadge(donor.donationCount)
      };
    });

    res.json({
      success: true,
      count: result.length,
      donors: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/donors/profile
 * @desc    Get current donor profile (for authenticated donor)
 * @access  Private
 */
const getMyDonorProfile = async (req, res, next) => {
  try {
    let donor = null;
    if (req.user?.donorProfileId) {
      donor = await Donor.findById(req.user.donorProfileId);
    } else if (req.user?.email) {
      donor = await Donor.findOne({ phone: req.user.phone });
    }

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found"
      });
    }

    const eligibility = calculateEligibility(donor.lastDonationDate);

    res.json({
      success: true,
      donor: {
        ...donor.toObject(),
        eligible: eligibility.eligible,
        daysSinceDonation: eligibility.daysSinceDonation,
        daysRemaining: eligibility.daysRemaining,
        badge: getDonorBadge(donor.donationCount)
      },
      eligibility
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/donors/:id
 * @desc    Get single donor by ID
 * @access  Public
 */
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const eligibility = calculateEligibility(donor.lastDonationDate);

    res.json({
      success: true,
      donor: {
        ...donor.toObject(),
        eligible: eligibility.eligible,
        daysSinceDonation: eligibility.daysSinceDonation,
        daysRemaining: eligibility.daysRemaining,
        badge: getDonorBadge(donor.donationCount)
      },
      eligibility
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/donors/:id
 * @desc    Update donor details
 * @access  Public / Authenticated
 */
const updateDonor = async (req, res, next) => {
  try {
    const existingDonor = await Donor.findById(req.params.id);

    if (!existingDonor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const lastDonationDate =
      req.body.lastDonationDate !== undefined
        ? req.body.lastDonationDate
        : existingDonor.lastDonationDate;

    const eligibility = calculateEligibility(lastDonationDate);

    const updateData = {
      ...req.body,
      eligible: eligibility.eligible
    };

    if (!eligibility.eligible) {
      updateData.available = false;
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      donor,
      eligibility,
      badge: getDonorBadge(donor.donationCount)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/donors/:id/availability
 * @desc    Toggle donor availability
 * @access  Public / Authenticated
 */
const updateDonorAvailability = async (req, res, next) => {
  try {
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "available must be true or false"
      });
    }

    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const eligibility = calculateEligibility(donor.lastDonationDate);

    if (available && !eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: "Donor is not currently eligible to donate due to the donation interval",
        eligibility
      });
    }

    donor.available = available;
    donor.eligible = eligibility.eligible;

    await donor.save();

    res.json({
      success: true,
      donor,
      eligibility
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/donors/:id
 * @desc    Delete donor record
 * @access  Public / Admin
 */
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    res.json({
      success: true,
      message: "Donor deleted"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonor,
  getDonors,
  getMyDonorProfile,
  getDonorById,
  updateDonor,
  updateDonorAvailability,
  deleteDonor
};
