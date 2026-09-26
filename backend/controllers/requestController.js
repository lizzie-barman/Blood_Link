const Joi = require("joi");
const EmergencyRequest = require("../models/EmergencyRequest");
const Donor = require("../models/Donor");
const { findMatchingDonors, findEscalatedMatches } = require("../services/donorMatching");
const { calculateEligibility } = require("../services/donorEligibility");
const forecastDemand = require("../services/demandForecast");
const {
  notifyNewEmergencyRequest,
  notifyRequestUpdated,
  notifyDonorMatched,
  notifyDonorDeclined,
  notifyRequestFulfilled,
  notifyRadiusEscalation
} = require("../services/notificationService");
const { getDonorBadge, BLOOD_GROUPS, BLOOD_COMPONENTS, URGENCY_LEVELS } = require("../utils/constants");

const emergencyRequestSchema = Joi.object({
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
 * @route   POST /api/requests
 * @desc    Create a new emergency blood request & trigger donor matching
 * @access  Public / Authenticated
 */
const createRequest = async (req, res, next) => {
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

    const searchRadius = Number(radius || 10);
    const matches = await findMatchingDonors(
      bloodGroup,
      location.lat,
      location.lng,
      searchRadius
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

    // Trigger centralized notifications
    notifyNewEmergencyRequest(request, matches);

    res.status(201).json({
      success: true,
      request,
      matchedDonors,
      matching: {
        radiusKm: searchRadius,
        totalEligibleNearbyDonors: matches.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests
 * @desc    Get all emergency requests (with optional status/hospital filters)
 * @access  Public / Authenticated
 */
const getRequests = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.hospitalName) {
      query.hospitalName = new RegExp(req.query.hospitalName, "i");
    }

    const requests = await EmergencyRequest.find(query)
      .populate("matchedDonorId")
      .populate("declinedDonorIds")
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

/**
 * @route   GET /api/requests/map/active
 * @desc    Get active requests formatted for map markers
 * @access  Public
 */
const getActiveRequestsMap = async (req, res, next) => {
  try {
    const requests = await EmergencyRequest.find({
      status: { $in: ["OPEN", "DONOR_MATCHED"] }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      markers: requests.map((request) => ({
        id: request._id,
        type: "EMERGENCY_REQUEST",
        hospitalName: request.hospitalName,
        bloodGroup: request.bloodGroup,
        component: request.component,
        unitsRequired: request.unitsRequired,
        urgency: request.urgency,
        status: request.status,
        location: request.location
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests/analytics/demand
 * @desc    Get 30-day demand forecast analytics
 * @access  Public
 */
const getDemandForecast = async (req, res, next) => {
  try {
    const forecast = await forecastDemand();

    res.json({
      success: true,
      period: "Next 7 days",
      basedOn: "Last 30 days of emergency requests",
      forecast
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/requests/:id
 * @desc    Get single emergency request by ID
 * @access  Public / Authenticated
 */
const getRequestById = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate("matchedDonorId")
      .populate("declinedDonorIds")
      .populate("notifiedDonorIds");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/requests/:id/accept
 * @desc    Donor accepts an open emergency request
 * @access  Public / Authenticated
 */
const acceptRequest = async (req, res, next) => {
  try {
    const { donorId } = req.body;

    if (!donorId) {
      return res.status(400).json({
        success: false,
        message: "donorId is required"
      });
    }

    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    if (request.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: `Request cannot be accepted because it is currently in '${request.status}' status`
      });
    }

    // Check if donor previously declined
    const hasDeclined = request.declinedDonorIds.some(
      (id) => id.toString() === donorId.toString()
    );

    if (hasDeclined) {
      return res.status(400).json({
        success: false,
        message: "This donor already declined the request"
      });
    }

    const donor = await Donor.findById(donorId);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const eligibility = calculateEligibility(donor.lastDonationDate);

    if (!eligibility.eligible || !donor.available) {
      return res.status(400).json({
        success: false,
        message: "Donor is not currently eligible or available for donation",
        eligibility
      });
    }

    // Atomic update status to prevent race conditions
    request.status = "DONOR_MATCHED";
    request.matchedDonorId = donor._id;
    request.matchedAt = new Date();

    donor.available = false;

    await request.save();
    await donor.save();

    // Centralized real-time update
    notifyDonorMatched(request, donor);

    res.json({
      success: true,
      message: "Emergency request accepted successfully",
      request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/requests/:id/decline
 * @desc    Donor declines an open emergency request
 * @access  Public / Authenticated
 */
const declineRequest = async (req, res, next) => {
  try {
    const { donorId } = req.body;

    if (!donorId) {
      return res.status(400).json({
        success: false,
        message: "donorId is required"
      });
    }

    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    if (request.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Request is no longer open"
      });
    }

    const alreadyDeclined = request.declinedDonorIds.some(
      (id) => id.toString() === donorId.toString()
    );

    if (!alreadyDeclined) {
      request.declinedDonorIds.push(donorId);
      await request.save();
    }

    // Real-time notification
    notifyDonorDeclined(request._id, donorId);

    res.json({
      success: true,
      message: "Request declined successfully",
      request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/requests/:id/fulfill
 * @desc    Mark emergency request fulfilled & record donation history
 * @access  Public / Authenticated
 */
const fulfillRequest = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    if (request.status === "FULFILLED") {
      return res.status(400).json({
        success: false,
        message: "Request is already fulfilled"
      });
    }

    if (request.status !== "DONOR_MATCHED") {
      return res.status(400).json({
        success: false,
        message: "A donor must be matched before the request can be fulfilled"
      });
    }

    const donor = await Donor.findById(request.matchedDonorId);

    request.status = "FULFILLED";
    request.fulfilledAt = new Date();
    await request.save();

    if (donor) {
      donor.donationCount = (donor.donationCount || 0) + 1;

      donor.donationHistory.push({
        requestId: request._id,
        date: new Date(),
        bloodGroup: request.bloodGroup,
        component: request.component,
        hospitalName: request.hospitalName
      });

      donor.lastDonationDate = new Date();
      donor.eligible = false;
      donor.available = false;

      await donor.save();
    }

    // Centralized real-time update
    notifyRequestFulfilled(request, donor);

    res.json({
      success: true,
      message: "Emergency request successfully fulfilled",
      request,
      donor: donor
        ? {
            id: donor._id,
            name: donor.name,
            donationCount: donor.donationCount,
            badge: getDonorBadge(donor.donationCount)
          }
        : null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/requests/:id/cancel
 * @desc    Cancel an emergency request
 * @access  Public / Authenticated
 */
const cancelRequest = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    if (request.status === "FULFILLED") {
      return res.status(400).json({
        success: false,
        message: "A fulfilled request cannot be cancelled"
      });
    }

    if (request.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Request is already cancelled"
      });
    }

    // If donor was matched, release them back to available if eligible
    if (request.matchedDonorId) {
      const donor = await Donor.findById(request.matchedDonorId);
      if (donor) {
        const eligibility = calculateEligibility(donor.lastDonationDate);
        donor.available = eligibility.eligible;
        await donor.save();
      }
    }

    request.status = "CANCELLED";
    await request.save();

    notifyRequestUpdated(request, { action: "CANCELLED" });

    res.json({
      success: true,
      message: "Emergency request cancelled successfully",
      request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/requests/:id/escalate
 * @desc    Manually or automatically escalate emergency request search radius
 * @access  Public / Authenticated
 */
const escalateRequestRadius = async (req, res, next) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    if (request.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Only open requests can be escalated"
      });
    }

    const newRadius = Number(req.body.radius || 20);

    const matches = await findMatchingDonors(
      request.bloodGroup,
      request.location.lat,
      request.location.lng,
      newRadius,
      {
        excludedDonorIds: request.declinedDonorIds.concat(request.notifiedDonorIds)
      }
    );

    const newlyNotifiedIds = matches.map((m) => m.donor._id);
    request.notifiedDonorIds = request.notifiedDonorIds.concat(newlyNotifiedIds);
    await request.save();

    notifyRadiusEscalation(request, newRadius, newlyNotifiedIds.length);

    res.json({
      success: true,
      message: `Radius escalated to ${newRadius} km`,
      escalation: {
        radiusKm: newRadius,
        newlyMatchedDonorsCount: matches.length,
        newMatches: matches.map((m) => ({
          donorId: m.donor._id,
          name: m.donor.name,
          distance: Number(m.distance.toFixed(2))
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compatibility handler for PATCH /api/emergency-requests/:id/respond
 */
const respondToRequestPatch = async (req, res, next) => {
  const { response, donorId } = req.body;
  if (response === "accept") {
    req.body = { donorId };
    return acceptRequest(req, res, next);
  }
  if (response === "decline") {
    req.body = { donorId };
    return declineRequest(req, res, next);
  }
  return res.status(400).json({
    success: false,
    message: "Invalid response type. Use 'accept' or 'decline'"
  });
};

module.exports = {
  createRequest,
  getRequests,
  getActiveRequestsMap,
  getDemandForecast,
  getRequestById,
  acceptRequest,
  declineRequest,
  fulfillRequest,
  cancelRequest,
  escalateRequestRadius,
  respondToRequestPatch
};
