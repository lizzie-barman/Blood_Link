const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyRequest"
    },
    date: {
      type: Date,
      default: Date.now
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    component: {
      type: String,
      enum: ["WHOLE_BLOOD", "PLASMA", "PLATELETS"]
    },
    hospitalName: {
      type: String
    }
  },
  { _id: false }
);

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    phone: {
      type: String,
      trim: true
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
    lastDonationDate: {
      type: Date,
      default: null
    },
    eligible: {
      type: Boolean,
      default: true
    },
    available: {
      type: Boolean,
      default: true
    },
    donationCount: {
      type: Number,
      default: 0,
      min: 0
    },
    donationHistory: {
      type: [donationHistorySchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);