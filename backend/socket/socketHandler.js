const { setSocketIO } = require("../services/notificationService");

/**
 * Socket.IO Handler - Configures rooms, events and connection lifecycle
 */
const initSocketHandler = (io) => {
  // Register IO instance with the notification service
  setSocketIO(io);

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room based on role or individual IDs
    socket.on("joinRole", (data) => {
      try {
        if (data?.role) {
          socket.join(data.role);
          console.log(`[Socket.IO] Socket ${socket.id} joined role room: ${data.role}`);
        }

        if (data?.userId) {
          socket.join(`USER_${data.userId}`);
          console.log(`[Socket.IO] Socket ${socket.id} joined user room: USER_${data.userId}`);
        }

        if (data?.donorId) {
          socket.join(`DONOR_${data.donorId}`);
          console.log(`[Socket.IO] Socket ${socket.id} joined donor room: DONOR_${data.donorId}`);
        }

        if (data?.hospitalId) {
          socket.join(`HOSPITAL_${data.hospitalId}`);
          console.log(`[Socket.IO] Socket ${socket.id} joined hospital room: HOSPITAL_${data.hospitalId}`);
        }
      } catch (err) {
        console.error(`[Socket.IO] Error in joinRole:`, err.message);
      }
    });

    // Custom room subscription for requests
    socket.on("joinRequest", (requestId) => {
      if (requestId) {
        socket.join(`REQUEST_${requestId}`);
      }
    });

    socket.on("leaveRequest", (requestId) => {
      if (requestId) {
        socket.leave(`REQUEST_${requestId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocketHandler;
