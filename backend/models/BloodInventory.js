const mongoose = require("mongoose");

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodBankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
      required: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    component: {
      type: String,
      required: true,
      enum: ["WHOLE_BLOOD", "PLASMA", "PLATELETS"]
    },
    units: {
      type: Number,
      default: 0,
      min: 0
    },
    expiryDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodInventory", bloodInventorySchema);