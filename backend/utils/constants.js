// BloodLink System Constants

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BLOOD_COMPONENTS = ["WHOLE_BLOOD", "PLASMA", "PLATELETS"];

const USER_ROLES = ["donor", "hospital", "bloodbank", "admin"];

const REQUEST_STATUSES = ["OPEN", "DONOR_MATCHED", "FULFILLED", "CANCELLED"];

const URGENCY_LEVELS = ["NORMAL", "URGENT", "CRITICAL"];

const DEFAULT_RADIUS_KM = 10;

const ESCALATION_RADII = [5, 10, 20];

const DEFAULT_DONATION_GAP_DAYS = 90;

const DONOR_BADGES = {
  LIFESAVER: { minDonations: 10, label: "Lifesaver" },
  HERO: { minDonations: 5, label: "Hero" },
  REGULAR_DONOR: { minDonations: 3, label: "Regular Donor" },
  FIRST_DONATION: { minDonations: 1, label: "First Donation" },
  NEW_DONOR: { minDonations: 0, label: "New Donor" }
};

const getDonorBadge = (count = 0) => {
  if (count >= 10) return "LIFESAVER";
  if (count >= 5) return "HERO";
  if (count >= 3) return "REGULAR_DONOR";
  if (count >= 1) return "FIRST_DONATION";
  return "NEW_DONOR";
};

// Blood Compatibility Map for Red Blood Cells / Whole Blood
const BLOOD_COMPATIBILITY = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};

// Returns donor blood groups that can donate to the recipient
const getCompatibleDonorGroups = (recipientGroup) => {
  const compatible = [];
  for (const [donorGroup, recipientList] of Object.entries(BLOOD_COMPATIBILITY)) {
    if (recipientList.includes(recipientGroup)) {
      compatible.push(donorGroup);
    }
  }
  return compatible.length > 0 ? compatible : [recipientGroup];
};

module.exports = {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  USER_ROLES,
  REQUEST_STATUSES,
  URGENCY_LEVELS,
  DEFAULT_RADIUS_KM,
  ESCALATION_RADII,
  DEFAULT_DONATION_GAP_DAYS,
  DONOR_BADGES,
  getDonorBadge,
  BLOOD_COMPATIBILITY,
  getCompatibleDonorGroups
};
