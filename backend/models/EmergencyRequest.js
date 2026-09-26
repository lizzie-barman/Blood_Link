const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true
    },
    hospitalPhone: {
      type: String,
      trim: true
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
    unitsRequired: {
      type: Number,
      required: true,
      min: 1
    },
    location: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    urgency: {
      type: String,
      enum: ["NORMAL", "URGENT", "CRITICAL"],
      default: "URGENT"
    },
    status: {
      type: String,
      enum: ["OPEN", "DONOR_MATCHED", "FULFILLED", "CANCELLED"],
      default: "OPEN"
    },
    matchedDonorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null
    },
    declinedDonorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor"
      }
    ],
    notifiedDonorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor"
      }
    ],
    matchedAt: {
      type: Date,
      default: null
    },
    fulfilledAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyRequest", emergencyRequestSchema);