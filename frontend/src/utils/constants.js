// BloodLink Application Constants

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export const BLOOD_COMPONENTS = [
  'Whole Blood',
  'Platelets',
  'Plasma'
];

export const REQUEST_STATUS = {
  OPEN: 'OPEN',
  DONOR_MATCHED: 'DONOR MATCHED',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED'
};

export const URGENCY_LEVELS = {
  CRITICAL: 'Critical',
  URGENT: 'Urgent',
  NORMAL: 'Normal'
};

export const USER_ROLES = {
  DONOR: 'DONOR',
  HOSPITAL: 'HOSPITAL',
  BLOOD_BANK: 'BLOOD_BANK'
};

export const DONATION_STATUS = {
  ELIGIBLE: 'Eligible',
  NOT_ELIGIBLE: 'Not Eligible'
};

export const NOTIFICATION_TYPES = {
  EMERGENCY_ALERT: 'EMERGENCY_ALERT',
  REQUEST_UPDATE: 'REQUEST_UPDATE',
  DONATION_REMINDER: 'DONATION_REMINDER',
  INVENTORY_ALERT: 'INVENTORY_ALERT'
};
