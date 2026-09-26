const donors = [
  {
    name: "Demo Donor 1",
    bloodGroup: "O+",
    phone: "9000000001",
    location: {
      lat: 22.5726,
      lng: 88.3639
    },
    lastDonationDate: new Date("2026-05-10"),
    eligible: true,
    available: true
  },
  {
    name: "Demo Donor 2",
    bloodGroup: "O+",
    phone: "9000000002",
    location: {
      lat: 22.5765,
      lng: 88.3692
    },
    lastDonationDate: new Date("2026-04-15"),
    eligible: true,
    available: true
  },
  {
    name: "Demo Donor 3",
    bloodGroup: "A+",
    phone: "9000000003",
    location: {
      lat: 22.5958,
      lng: 88.402
    },
    lastDonationDate: new Date("2026-05-20"),
    eligible: true,
    available: true
  },
  {
    name: "Demo Donor 4",
    bloodGroup: "B+",
    phone: "9000000004",
    location: {
      lat: 22.52,
      lng: 88.35
    },
    lastDonationDate: new Date("2026-04-20"),
    eligible: true,
    available: true
  }
];

module.exports = donors;
