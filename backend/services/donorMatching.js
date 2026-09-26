const Donor = require("../models/Donor");
const { calculateEligibility } = require("./donorEligibility");
const {
  DEFAULT_RADIUS_KM,
  ESCALATION_RADII,
  getCompatibleDonorGroups
} = require("../utils/constants");

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius in kilometers

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Finds eligible, available donors within specified radius matching recipient blood group
 * Supports exact or compatibility matching rules
 */
const findMatchingDonors = async (
  bloodGroup,
  lat,
  lng,
  radius = DEFAULT_RADIUS_KM,
  options = {}
) => {
  const { exactMatchOnly = false, excludedDonorIds = [] } = options;

  const targetGroups = exactMatchOnly
    ? [bloodGroup]
    : getCompatibleDonorGroups(bloodGroup);

  const query = {
    bloodGroup: { $in: targetGroups },
    available: true
  };

  if (excludedDonorIds && excludedDonorIds.length > 0) {
    query._id = { $nin: excludedDonorIds };
  }

  const donors = await Donor.find(query);

  return donors
    .map((donor) => {
      const eligibility = calculateEligibility(donor.lastDonationDate);
      const distance = calculateDistance(
        lat,
        lng,
        donor.location.lat,
        donor.location.lng
      );

      return {
        donor,
        distance,
        eligibility
      };
    })
    .filter(
      (item) => item.eligibility.eligible && item.distance <= Number(radius)
    )
    .sort((a, b) => a.distance - b.distance)
    .map((item) => {
      const isExact = item.donor.bloodGroup === bloodGroup;
      const reasons = [
        isExact
          ? `Exact blood group match (${item.donor.bloodGroup})`
          : `Compatible blood group (${item.donor.bloodGroup} for ${bloodGroup})`,
        "Eligible donor interval",
        "Currently available",
        `Within ${radius} km radius (${item.distance.toFixed(2)} km)`
      ];

      return {
        donor: item.donor,
        distance: item.distance,
        eligibility: item.eligibility,
        matchReason: reasons
      };
    });
};

/**
 * Multi-tier Escalation Matching: Searches in configurable tiers (e.g. 5km, 10km, 20km)
 */
const findEscalatedMatches = async (
  bloodGroup,
  lat,
  lng,
  tierRadii = ESCALATION_RADII,
  options = {}
) => {
  const tiers = [];
  const alreadyMatchedIds = new Set(
    (options.excludedDonorIds || []).map((id) => id.toString())
  );

  for (const radius of tierRadii) {
    const matches = await findMatchingDonors(bloodGroup, lat, lng, radius, {
      ...options,
      excludedDonorIds: Array.from(alreadyMatchedIds)
    });

    matches.forEach((m) => alreadyMatchedIds.add(m.donor._id.toString()));

    tiers.push({
      radiusKm: radius,
      count: matches.length,
      matches
    });
  }

  return tiers;
};

module.exports = {
  calculateDistance,
  calculateEligibility,
  findMatchingDonors,
  findEscalatedMatches
};