const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: String,
    phone: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodBank", bloodBankSchema);