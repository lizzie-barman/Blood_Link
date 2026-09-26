const { DEFAULT_DONATION_GAP_DAYS } = require("../utils/constants");

/**
 * Calculates donor donation eligibility based on the last donation date.
 * Note: This is an interval-based scheduling check, not a medical determination.
 * 
 * @param {Date|string|null} lastDonationDate 
 * @param {number} gapDays Optional donation interval (defaults to env or 90 days)
 * @returns {object} { eligible: boolean, daysSinceDonation: number|null, daysRemaining: number }
 */
const calculateEligibility = (lastDonationDate, gapDays = null) => {
  const configuredGap = Number(
    gapDays || process.env.DONATION_GAP_DAYS || DEFAULT_DONATION_GAP_DAYS
  );

  if (!lastDonationDate) {
    return {
      eligible: true,
      daysSinceDonation: null,
      daysRemaining: 0,
      gapDays: configuredGap
    };
  }

  const lastDonation = new Date(lastDonationDate);

  if (Number.isNaN(lastDonation.getTime())) {
    return {
      eligible: false,
      daysSinceDonation: null,
      daysRemaining: configuredGap,
      gapDays: configuredGap
    };
  }

  const now = new Date();

  const daysSinceDonation = Math.floor(
    (now.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysRemaining = Math.max(configuredGap - daysSinceDonation, 0);

  return {
    eligible: daysSinceDonation >= configuredGap,
    daysSinceDonation,
    daysRemaining,
    gapDays: configuredGap
  };
};

module.exports = {
  calculateEligibility
};
