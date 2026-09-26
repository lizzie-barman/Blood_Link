const EmergencyRequest = require("../models/EmergencyRequest");

const forecastDemand = async () => {
  const DAYS = 30;

  const since = new Date(
    Date.now() -
      DAYS * 24 * 60 * 60 * 1000
  );

  const requests = await EmergencyRequest.find({
    createdAt: {
      $gte: since
    }
  });

  const groups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ];

  const demand = {};

  groups.forEach((group) => {
    demand[group] = {
      requests: 0,
      units: 0
    };
  });

  requests.forEach((request) => {
    if (!demand[request.bloodGroup]) {
      return;
    }

    demand[request.bloodGroup].requests += 1;
    demand[request.bloodGroup].units +=
      request.unitsRequired;
  });

  const result = groups.map((group) => {
    const units =
      demand[group].units;

    const averageDailyDemand =
      units / DAYS;

    return {
      bloodGroup: group,
      requestsLast30Days:
        demand[group].requests,
      unitsRequestedLast30Days: units,
      averageDailyDemand: Number(
        averageDailyDemand.toFixed(2)
      ),
      projectedNext7Days: Math.ceil(
        averageDailyDemand * 7
      )
    };
  });

  return result.sort(
    (a, b) =>
      b.projectedNext7Days -
      a.projectedNext7Days
  );
};

module.exports = forecastDemand;