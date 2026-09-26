const express = require("express");
const {
  createBloodBank,
  getBloodBanks,
  getBloodBanksMap,
  getBloodBankById,
  updateBloodBank,
  createInventory,
  getInventory,
  updateInventory,
  getExpiringInventory,
  searchAvailableBlood
} = require("../controllers/bloodBankController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Blood Bank routes
router.post("/", optionalAuth, createBloodBank);
router.get("/", getBloodBanks);
router.get("/map", getBloodBanksMap);
router.get("/search", searchAvailableBlood);
router.get("/search/available", searchAvailableBlood);

// Inventory routes
router.post("/inventory", optionalAuth, createInventory);
router.get("/inventory", getInventory);
router.get("/inventory/expiring", getExpiringInventory);
router.put("/inventory/:id", optionalAuth, updateInventory);

// Parameterized route should be last
router.get("/:id", getBloodBankById);
router.put("/:id", protect, updateBloodBank);

module.exports = router;