const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { USER_ROLES } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false // Exclude from query results by default
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "donor"
    },
    phone: {
      type: String,
      trim: true
    },
    // Optional link to specific role profile if created
    donorProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null
    },
    hospitalProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null
    },
    bloodBankProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Safe JSON serialization
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
