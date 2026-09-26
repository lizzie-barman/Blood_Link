const express = require("express");
const {
  createDonor,
  getDonors,
  getMyDonorProfile,
  getDonorById,
  updateDonor,
  updateDonorAvailability,
  deleteDonor
} = require("../controllers/donorController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createDonor);
router.post("/register", createDonor); // Compatibility alias
router.get("/", getDonors);
router.get("/profile", protect, getMyDonorProfile); // Authenticated donor profile
router.get("/:id", getDonorById);
router.put("/:id", optionalAuth, updateDonor);
router.put("/:id/availability", optionalAuth, updateDonorAvailability);
router.delete("/:id", optionalAuth, deleteDonor);

module.exports = router;