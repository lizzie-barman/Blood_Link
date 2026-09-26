const express = require("express");
const {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  createHospitalRequest,
  getHospitalRequests
} = require("../controllers/hospitalController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", optionalAuth, createHospital);
router.get("/", getHospitals);
router.post("/request", optionalAuth, createHospitalRequest);
router.get("/:id", getHospitalById);
router.put("/:id", protect, updateHospital);
router.get("/:id/requests", getHospitalRequests);

module.exports = router;
