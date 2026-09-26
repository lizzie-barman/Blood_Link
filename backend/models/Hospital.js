const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true
    },
    address: {
      type: String,
      required: [true, "Hospital address is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Hospital contact phone is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    location: {
      lat: {
        type: Number,
        required: [true, "Hospital latitude is required"],
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: [true, "Hospital longitude is required"],
        min: -180,
        max: 180
      }
    },
    emergencyContact: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
