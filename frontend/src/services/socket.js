// BloodLink Real-Time Socket Service (Socket.IO)
import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;

    this.standardEvents = [
      'newEmergencyRequest',
      'emergencyAlert',
      'donorMatched',
      'requestUpdated',
      'notification'
    ];
  }

  connect(token = null) {
    if (this.socket && this.socket.connected) {
      return;
    }

    try {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        auth: token ? { token } : {}
      });

      this.socket.on('connect', () => {
        this.isConnected = true;

        console.info(
          '[BloodLink Socket] Connected to real-time server'
        );

        this.triggerLocal('connect', {
          socketId: this.socket.id
        });
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;

        console.info(
          '[BloodLink Socket] Disconnected'
        );

        this.triggerLocal('disconnect');
      });

      this.socket.on('connect_error', (error) => {
        console.warn(
          '[BloodLink Socket] Connection error:',
          error.message
        );
      });

      this.standardEvents.forEach((eventName) => {
        this.socket.on(eventName, (data) => {
          this.triggerLocal(eventName, data);
        });
      });
    } catch (error) {
      console.warn(
        '[BloodLink Socket] Connection error:',
        error.message
      );

      this.isConnected = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);

    if (
      this.socket &&
      !this.standardEvents.includes(event) &&
      event !== 'connect' &&
      event !== 'disconnect'
    ) {
      this.socket.on(event, callback);
    }

    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (
      this.socket &&
      !this.standardEvents.includes(event) &&
      event !== 'connect' &&
      event !== 'disconnect'
    ) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  joinRole(data) {
    const sendJoin = () => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('joinRole', data);
      }
    };

    if (this.socket && this.socket.connected) {
      sendJoin();
      return;
    }

    if (this.socket) {
      this.socket.once('connect', sendJoin);
      return;
    }

    this.connect(localStorage.getItem('bloodlink_token'));

    if (this.socket) {
      this.socket.once('connect', sendJoin);
    }
  }

  joinRequest(requestId) {
    this.emit('joinRequest', requestId);
  }

  leaveRequest(requestId) {
    this.emit('leaveRequest', requestId);
  }

  triggerLocal(event, data) {
    if (!this.listeners.has(event)) {
      return;
    }

    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(
          `Error in socket listener for ${event}:`,
          error
        );
      }
    });
  }
}

export const socket = new SocketService();

export default socket;