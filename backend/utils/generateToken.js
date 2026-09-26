const jwt = require("jsonwebtoken");

const generateToken = (payload, expiresIn = "7d") => {
  const secret = process.env.JWT_SECRET || "bloodlink_secure_secret_key_2026";
  
  // Safe minimal payload
  const tokenData = {
    id: payload._id || payload.id,
    email: payload.email,
    role: payload.role,
    name: payload.name
  };

  return jwt.sign(tokenData, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "bloodlink_secure_secret_key_2026";
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
