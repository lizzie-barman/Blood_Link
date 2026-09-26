/**
 * Centralized Real-time Notification Service for BloodLink
 * Dispatches Socket.IO events to relevant rooms and connected clients
 */

let ioInstance = null;

const setSocketIO = (io) => {
  ioInstance = io;
};

const getSocketIO = () => {
  return ioInstance;
};

/**
 * Notifies specific matched donors about a new emergency request
 */
const notifyNewEmergencyRequest = (request, matches = []) => {
  if (!ioInstance) return;

  matches.forEach((match) => {
    const donorId = match.donor?._id || match.donorId;

    if (!donorId) return;

    const requestId = request._id?.toString();

    const emergencyPayload = {
      request,
      distance: match.distance,
      matchReason: match.matchReason,
      timestamp: new Date()
    };

    const notificationPayload = {
      id: `emergency-${requestId}-${donorId}`,
      role: "donor",
      title: `🚨 Emergency ${request.bloodGroup} request`,
      message: `${request.hospitalName || "A hospital"} needs ${request.unitsRequired} units of ${request.component || "Blood"}.`,
      type: "EMERGENCY_ALERT",
      requestId,
      bloodGroup: request.bloodGroup,
      component: request.component,
      hospitalName: request.hospitalName,
      distance: match.distance,
      timestamp: new Date(),
      read: false
    };

    ioInstance
      .to(`DONOR_${donorId}`)
      .emit("emergencyAlert", emergencyPayload);

    ioInstance
      .to(`DONOR_${donorId}`)
      .emit("notification", notificationPayload);
  });
};

/**
 * Emits when a request status changes or details are updated
 */
const notifyRequestUpdated = (request, meta = {}) => {
  if (!ioInstance) return;

  ioInstance.emit("requestUpdated", {
    request,
    ...meta
  });

  ioInstance.emit("notification", {
    type: "REQUEST_UPDATE",
    requestId: request._id,
    status: request.status,
    hospitalName: request.hospitalName,
    bloodGroup: request.bloodGroup,
    timestamp: new Date()
  });
};

/**
 * Emits when a donor accepts a request
 */
const notifyDonorMatched = (request, donor) => {
  if (!ioInstance) return;

  ioInstance.emit("donorMatched", {
    requestId: request._id,
    request,
    donor: {
      id: donor._id,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      phone: donor.phone
    },
    timestamp: new Date()
  });

  ioInstance.emit("requestUpdated", {
    request
  });
};

/**
 * Emits when a donor declines a request
 */
const notifyDonorDeclined = (requestId, donorId) => {
  if (!ioInstance) return;

  ioInstance.emit("donorDeclined", {
    requestId,
    donorId,
    timestamp: new Date()
  });
};

/**
 * Emits when a request is fulfilled
 */
const notifyRequestFulfilled = (request, donor) => {
  if (!ioInstance) return;

  ioInstance.emit("requestFulfilled", {
    requestId: request._id,
    request,
    donor: donor
      ? {
          id: donor._id,
          name: donor.name,
          donationCount: donor.donationCount
        }
      : null,
    timestamp: new Date()
  });

  ioInstance.emit("requestUpdated", {
    request
  });
};

/**
 * Emits when radius is escalated to next tier
 */
const notifyRadiusEscalation = (
  request,
  newRadius,
  newlyNotifiedCount
) => {
  if (!ioInstance) return;

  ioInstance.emit("radiusEscalated", {
    requestId: request._id,
    newRadius,
    newlyNotifiedCount,
    timestamp: new Date()
  });
};

module.exports = {
  setSocketIO,
  getSocketIO,
  notifyNewEmergencyRequest,
  notifyRequestUpdated,
  notifyDonorMatched,
  notifyDonorDeclined,
  notifyRequestFulfilled,
  notifyRadiusEscalation
};