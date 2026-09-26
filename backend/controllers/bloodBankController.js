const Joi = require("joi");
const BloodBank = require("../models/BloodBank");
const BloodInventory = require("../models/BloodInventory");
const { calculateDistance } = require("../services/donorMatching");
const { BLOOD_GROUPS, BLOOD_COMPONENTS } = require("../utils/constants");

const bloodBankSchema = Joi.object({
  name: Joi.string().trim().required(),
  address: Joi.string().trim().allow("", null),
  phone: Joi.string().trim().allow("", null),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).optional()
});

const inventorySchema = Joi.object({
  bloodBankId: Joi.string().required(),
  bloodGroup: Joi.string().valid(...BLOOD_GROUPS).required(),
  component: Joi.string().valid(...BLOOD_COMPONENTS).required(),
  units: Joi.number().integer().min(0).required(),
  expiryDate: Joi.date().iso().allow(null, "")
});

/**
 * @route   POST /api/blood-banks
 * @desc    Create a new blood bank
 * @access  Public / Authenticated
 */
const createBloodBank = async (req, res, next) => {
  try {
    const { error, value } = bloodBankSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const bloodBank = await BloodBank.create(value);

    res.status(201).json({
      success: true,
      bloodBank
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks
 * @desc    Get all blood banks
 * @access  Public
 */
const getBloodBanks = async (req, res, next) => {
  try {
    const bloodBanks = await BloodBank.find().sort({ name: 1 });

    res.json({
      success: true,
      count: bloodBanks.length,
      bloodBanks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks/map
 * @desc    Get map markers for all blood banks
 * @access  Public
 */
const getBloodBanksMap = async (req, res, next) => {
  try {
    const bloodBanks = await BloodBank.find().sort({ name: 1 });

    res.json({
      success: true,
      count: bloodBanks.length,
      markers: bloodBanks.map((bank) => ({
        id: bank._id,
        type: "BLOOD_BANK",
        name: bank.name,
        address: bank.address,
        phone: bank.phone,
        location: bank.location
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks/:id
 * @desc    Get blood bank by ID
 * @access  Public
 */
const getBloodBankById = async (req, res, next) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    res.json({
      success: true,
      bloodBank
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/blood-banks/:id
 * @desc    Update blood bank details
 * @access  Public / Authenticated
 */
const updateBloodBank = async (req, res, next) => {
  try {
    const bloodBank = await BloodBank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    res.json({
      success: true,
      bloodBank
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/blood-banks/inventory
 * @desc    Create inventory item
 * @access  Public / Authenticated
 */
const createInventory = async (req, res, next) => {
  try {
    const { error, value } = inventorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const bloodBank = await BloodBank.findById(value.bloodBankId);
    if (!bloodBank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found"
      });
    }

    const inventory = await BloodInventory.create(value);

    res.status(201).json({
      success: true,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks/inventory
 * @desc    Get all inventory records with expiry intelligence
 * @access  Public
 */
const getInventory = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.bloodBankId) {
      query.bloodBankId = req.query.bloodBankId;
    }

    const inventory = await BloodInventory.find(query)
      .populate("bloodBankId")
      .sort({ updatedAt: -1 });

    const now = new Date();

    const result = inventory.map((item) => {
      const expired = item.expiryDate && new Date(item.expiryDate) < now;
      const daysToExpiry = item.expiryDate
        ? Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...item.toObject(),
        expired,
        daysToExpiry
      };
    });

    res.json({
      success: true,
      count: result.length,
      inventory: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/blood-banks/inventory/:id
 * @desc    Update single inventory record
 * @access  Public / Authenticated
 */
const updateInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("bloodBankId");

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory record not found"
      });
    }

    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks/inventory/expiring
 * @desc    Get inventory items expiring in next N days
 * @access  Public
 */
const getExpiringInventory = async (req, res, next) => {
  try {
    const days = Number(req.query.days || 7);

    if (!Number.isFinite(days) || days < 0) {
      return res.status(400).json({
        success: false,
        message: "days must be a valid positive number"
      });
    }

    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const inventory = await BloodInventory.find({
      units: { $gt: 0 },
      expiryDate: {
        $gte: now,
        $lte: futureDate
      }
    })
      .populate("bloodBankId")
      .sort({ expiryDate: 1 });

    res.json({
      success: true,
      days,
      count: inventory.length,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/blood-banks/search/available
 * @route   GET /api/blood-banks/search
 * @desc    Search available non-expired blood stock with location & radius
 * @access  Public
 */
const searchAvailableBlood = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      component,
      latitude,
      longitude,
      radius = 20
    } = req.query;

    const filter = {
      units: { $gt: 0 }
    };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (component) {
      filter.component = component;
    }

    const inventory = await BloodInventory.find(filter).populate("bloodBankId");
    const now = new Date();

    let results = inventory
      .filter((item) => {
        if (!item.expiryDate) {
          return true;
        }
        return new Date(item.expiryDate) >= now;
      })
      .map((item) => {
        const bank = item.bloodBankId;
        let distance = null;

        if (
          latitude !== undefined &&
          longitude !== undefined &&
          bank?.location?.lat !== undefined &&
          bank?.location?.lng !== undefined
        ) {
          distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            bank.location.lat,
            bank.location.lng
          );
        }

        const daysToExpiry = item.expiryDate
          ? Math.ceil((new Date(item.expiryDate) - now) / (1000 * 60 * 60 * 24))
          : null;

        return {
          inventoryId: item._id,
          bloodGroup: item.bloodGroup,
          component: item.component,
          units: item.units,
          expiryDate: item.expiryDate,
          daysToExpiry,
          lastUpdated: item.updatedAt,
          bloodBank: bank
            ? {
                id: bank._id,
                name: bank.name,
                address: bank.address,
                phone: bank.phone,
                location: bank.location
              }
            : null,
          distance:
            distance === null ? null : Number(distance.toFixed(2))
        };
      });

    if (latitude !== undefined && longitude !== undefined) {
      results = results
        .filter(
          (item) =>
            item.distance !== null && item.distance <= Number(radius)
        )
        .sort((a, b) => a.distance - b.distance);
    }

    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
