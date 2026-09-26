const express = require("express");

const {
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
} = require("../controllers/requestController");

const {
  protect,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// EMERGENCY REQUEST CREATION
// HOSPITAL ONLY
// ==========================================

router.post(
  "/",
  protect,
  requireRole("hospital"),
  createRequest
);

// ==========================================
// VIEW REQUESTS
// ==========================================

router.get(
  "/",
  protect,
  getRequests
);

router.get(
  "/map/active",
  protect,
  getActiveRequestsMap
);

router.get(
  "/analytics/demand",
  protect,
  getDemandForecast
);

// ==========================================
// DONOR ACTIONS
// ==========================================

router.put(
  "/:id/accept",
  protect,
  requireRole("donor"),
  acceptRequest
);

router.put(
  "/:id/decline",
  protect,
  requireRole("donor"),
  declineRequest
);

// ==========================================
// HOSPITAL / BLOOD BANK ACTIONS
// ==========================================

router.put(
  "/:id/fulfill",
  protect,
  requireRole("hospital", "bloodbank"),
  fulfillRequest
);

router.put(
  "/:id/cancel",
  protect,
  requireRole("hospital"),
  cancelRequest
);

router.post(
  "/:id/escalate",
  protect,
  requireRole("hospital"),
  escalateRequestRadius
);

// Compatibility endpoint
router.patch(
  "/:id/respond",
  protect,
  requireRole("donor"),
  respondToRequestPatch
);

// ==========================================
// REQUEST DETAILS
// ==========================================

router.get(
  "/:id",
  protect,
  getRequestById
);

module.exports = router;