const { verifyToken } = require("../utils/generateToken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or account removed"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid or expired token"
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no bearer token provided"
    });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore invalid token for optional authentication.
    }
  }

  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = String(req.user.role || "")
      .toLowerCase()
      .replace("_", "");

    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toLowerCase().replace("_", "")
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action"
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  requireRole
};