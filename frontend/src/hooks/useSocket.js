import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import socket from '../services/socket';
import {
  getInventory,
  getEmergencyRequests,
  getDonorProfile,
  createEmergencyRequest as createEmergencyRequestApi,
  acceptRequest,
  fulfillRequest,
  cancelRequest
} from '../services/api';

export const useSocket = (eventName, callback) => {
  const [isConnected, setIsConnected] = useState(socket.isConnected);

  useEffect(() => {
    socket.connect(localStorage.getItem('bloodlink_token'));
    setIsConnected(socket.isConnected);

    const unsubscribeConnect = socket.on('connect', () => {
      setIsConnected(true);
    });

    const unsubscribeDisconnect = socket.on('disconnect', () => {
      setIsConnected(false);
    });

    let unsubscribeEvent = null;

    if (eventName && callback) {
      unsubscribeEvent = socket.on(eventName, callback);
    }

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();

      if (unsubscribeEvent) {
        unsubscribeEvent();
      }
    };
  }, [eventName, callback]);

  const emit = useCallback((event, data) => {
    socket.emit(event, data);
  }, []);

  return {
    isConnected,
    emit
  };
};

const BloodLinkContext = createContext(null);

export const BloodLinkProvider = ({ children }) => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem('bloodlink_user') || 'null'
      );
      return String(user?.role || 'donor').toLowerCase().replace('_', '');
    } catch {
      return 'donor';
    }
  });
  const [emergencyFlash, setEmergencyFlash] = useState(null);

  const [stats, setStats] = useState({
    bloodBanks: 0,
    registeredDonors: 0,
    activeRequests: 0,
    unitsAvailable: 0,
    livesSaved: 0
  });

  const addNotification = useCallback((notifData) => {
    const newNotif = {
      id: notifData?.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: notifData?.timestamp || new Date().toISOString(),
      read: false,
      ...notifData
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      const response = await getInventory();
      const inventoryData = response.inventory || [];
      setInventory(inventoryData);

      const activeInventory = inventoryData.filter((item) => !item.expired);
      const banks = [];
      const bankIds = new Set();

      activeInventory.forEach((item) => {
        const bank = item.bloodBankId;
        if (!bank || !bank._id || bankIds.has(bank._id)) return;
        bankIds.add(bank._id);

        banks.push({
          id: bank._id,
          name: bank.name,
          address: bank.address,
          phone: bank.phone,
          location: bank.address,
          coordinates: bank.location ? { lat: bank.location.lat, lng: bank.location.lng } : null
        });
      });

      setBloodBanks(banks);

      const unitsAvailable = activeInventory.reduce((total, item) => total + Number(item.units || 0), 0);
      setStats((prev) => ({ ...prev, bloodBanks: banks.length, unitsAvailable }));
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }, []);

  const loadEmergencyRequests = useCallback(async () => {
    try {
      const response = await getEmergencyRequests();
      setRequests(response.requests || []);
    } catch (error) {
      console.warn('Failed to load emergency requests:', error.message);
    }
  }, []);

  const loadDonorProfile = useCallback(async () => {
    const token = localStorage.getItem('bloodlink_token');
    const storedUser = localStorage.getItem('bloodlink_user');

    if (!token || !storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      const role = String(user?.role || '').toLowerCase().replace('_', '');
      // Always allow fetch if role is donor, or if we need to update state generally
      if (role !== 'donor') return;
      
      const response = await getDonorProfile();
      if (response?.donor) {
        const donor = response.donor;
        setDonors([donor]);
        setStats((prev) => ({ ...prev, registeredDonors: 1 }));

        socket.connect(token);
        socket.joinRole({
          role: 'donor',
          donorId: donor._id,
          userId: donor._id
        });
      }
    } catch (error) {
      console.warn('Donor profile unavailable:', error.message);
    }
  }, []);

  useEffect(() => {
    loadInventory();
    loadEmergencyRequests();
    loadDonorProfile();
  }, [loadInventory, loadEmergencyRequests, loadDonorProfile]);

  useEffect(() => {
    socket.connect(localStorage.getItem('bloodlink_token'));

    const unsubscribeNewRequest = socket.on('newEmergencyRequest', (payload) => {
      const newRequest = payload?.request || payload;
      if (!newRequest) return;
      const newId = String(newRequest._id || newRequest.id);
      setRequests((prev) => [
        newRequest,
        ...prev.filter((request) => String(request._id || request.id) !== newId)
      ]);
    });

    const unsubscribeEmergencyAlert = socket.on('emergencyAlert', (payload) => {
      const emergencyRequest = payload?.request || payload;
      if (!emergencyRequest) return;
      const requestId = String(emergencyRequest._id || emergencyRequest.id);

      setRequests((prev) => [
        emergencyRequest,
        ...prev.filter((request) => String(request._id || request.id) !== requestId)
      ]);

      const notification = addNotification({
        id: `emergency-${requestId}`,
        role: 'donor',
        title: `🚨 Emergency ${emergencyRequest.bloodGroup || ''} request`,
        message: `${emergencyRequest.hospitalName || 'A hospital'} needs ${emergencyRequest.unitsRequired || 0} units of ${emergencyRequest.component || 'Blood'}.`,
        type: 'EMERGENCY_ALERT',
        requestId,
        bloodGroup: emergencyRequest.bloodGroup,
        component: emergencyRequest.component,
        hospitalName: emergencyRequest.hospitalName,
        distance: payload?.distance,
        timestamp: payload?.timestamp || new Date().toISOString(),
        read: false
      });

      setEmergencyFlash(notification);
      window.setTimeout(() => {
        setEmergencyFlash((current) => current?.id === notification.id ? null : current);
      }, 8000);
    });

    const unsubscribeMatched = socket.on('donorMatched', ({ requestId, donor }) => {
      const matchedRequestId = String(requestId);
      setRequests((prev) =>
        prev.map((request) => {
          if (String(request._id || request.id) !== matchedRequestId) return request;
          return {
            ...request,
            status: 'DONOR_MATCHED',
            matchedDonorId: donor?.id || donor?._id || request.matchedDonorId,
            matchedDonor: donor
          };
        })
      );

      addNotification({
        role: 'hospital',
        title: 'Donor matched',
        message: donor?.name ? `${donor.name} has been matched to the emergency request.` : 'A donor has been matched.',
        type: 'REQUEST_UPDATE',
        requestId
      });
    });

    const unsubscribeRequestUpdated = socket.on('requestUpdated', (payload) => {
      const updatedRequest = payload?.request || payload;
      if (!updatedRequest) return;

      const updatedId = String(updatedRequest._id || updatedRequest.id);
      
      setRequests((prev) =>
        prev.map((request) => {
          if (String(request._id || request.id) !== updatedId) return request;
          return {
            ...request,
            ...updatedRequest,
            matchedDonorId: updatedRequest.matchedDonorId || request.matchedDonorId,
            matchedDonor: updatedRequest.matchedDonor || request.matchedDonor
          };
        })
      );

      // CRITICAL FIX: Instantly refresh donor data when a request is fulfilled to update history & counts
      if (updatedRequest.status === 'FULFILLED') {
        loadDonorProfile();
      }
    });

    const unsubscribeNotification = socket.on('notification', (notif) => {
      if (!notif) return;
      const notification = addNotification(notif);

      if (notif.type === 'EMERGENCY_ALERT') {
        setEmergencyFlash(notification);
        window.setTimeout(() => {
          setEmergencyFlash((current) => current?.id === notification.id ? null : current);
        }, 8000);
      }
      
      // Secondary check: if notification is about fulfillment, reload profile
      if (notif.type === 'REQUEST_FULFILLED' || (notif.title && notif.title.toLowerCase().includes('fulfilled'))) {
        loadDonorProfile();
      }
    });

    return () => {
      unsubscribeNewRequest();
      unsubscribeEmergencyAlert();
      unsubscribeMatched();
      unsubscribeRequestUpdated();
      unsubscribeNotification();
    };
  }, [addNotification, loadDonorProfile]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) => notification.id === id ? { ...notification, read: true } : notification)
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  const createEmergencyRequest = useCallback(async (formData) => {
    const response = await createEmergencyRequestApi(formData);
    const newRequest = response.request || response;
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  }, []);

  const acceptEmergencyRequest = useCallback(async (requestId, donorId) => {
    if (!requestId || !donorId) throw new Error('Request ID and Donor ID are required.');
    const response = await acceptRequest(requestId, donorId);
    const updatedRequest = response.request || response;

    setRequests((prev) =>
      prev.map((request) => String(request._id || request.id) !== String(requestId) ? request : { ...request, ...updatedRequest })
    );
    return updatedRequest;
  }, []);

  const fulfillEmergencyRequest = useCallback(async (requestId) => {
    const response = await fulfillRequest(requestId);
    const updatedRequest = response.request || response;

    setRequests((prev) =>
      prev.map((request) => String(request._id || request.id) !== String(requestId) ? request : { ...request, ...updatedRequest })
    );
    
    // In case testing on the same browser, reload donor immediately
    loadDonorProfile();
    return updatedRequest;
  }, [loadDonorProfile]);

  const cancelEmergencyRequest = useCallback(async (requestId) => {
    const response = await cancelRequest(requestId);
    const updatedRequest = response.request || response;

    setRequests((prev) =>
      prev.map((request) => String(request._id || request.id) !== String(requestId) ? request : { ...request, ...updatedRequest })
    );
    return updatedRequest;
  }, []);

  const updateInventoryStock = useCallback((updatedInventory) => {
    setInventory(updatedInventory);
  }, []);

  const contextValue = {
    bloodBanks, inventory, donors, requests, notifications, currentRole, setCurrentRole,
    stats, emergencyFlash, setEmergencyFlash, createEmergencyRequest, acceptEmergencyRequest,
    fulfillEmergencyRequest, cancelEmergencyRequest, updateInventoryStock, markNotificationAsRead,
    markAllNotificationsAsRead, addNotification, loadInventory, loadEmergencyRequests
  };

  return React.createElement(BloodLinkContext.Provider, { value: contextValue }, children);
};

export const useBloodLink = () => {
  const context = useContext(BloodLinkContext);
  if (!context) throw new Error('useBloodLink must be used within a BloodLinkProvider');
  return context;
};

export default useSocket;