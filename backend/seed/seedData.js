const dotenv = require("dotenv");
const connectDB = require("../config/db");

const Donor = require("../models/Donor");
const BloodBank = require("../models/BloodBank");
const BloodInventory = require("../models/BloodInventory");
const Hospital = require("../models/Hospital");
const User = require("../models/User");

const bloodBanksData = require("./bloodBanks");
const inventoryData = require("./inventory");
const donorsData = require("./donors");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing database collections...");
    await Donor.deleteMany();
    await BloodBank.deleteMany();
    await BloodInventory.deleteMany();
    await Hospital.deleteMany();

    console.log("Seeding Blood Banks from seed/bloodBanks.js...");
    const bloodBanks = await BloodBank.insertMany(bloodBanksData);

    console.log("Seeding Inventory from seed/inventory.js...");
    // Associate inventory records with the created blood banks
    const inventoryWithBanks = inventoryData.map((item, index) => ({
      ...item,
      bloodBankId: bloodBanks[index % bloodBanks.length]._id
    }));
    const inventory = await BloodInventory.insertMany(inventoryWithBanks);

    console.log("Seeding Donors from seed/donors.js...");
    const donors = await Donor.insertMany(donorsData);

    console.log("Seeding Sample Hospitals...");
    const hospitals = await Hospital.insertMany([
      {
        name: "Medical College Hospital",
        address: "88 College Street, Kolkata 700073",
        phone: "03322551538",
        email: "emergency@mchk.edu.in",
        location: { lat: 22.5746, lng: 88.3639 }
      },
      {
        name: "Apollo Gleneagles Hospital",
        address: "58 Canal Circular Road, Kolkata 700054",
        phone: "03323202122",
        email: "emergency@apollogleneagles.in",
        location: { lat: 22.577, lng: 88.397 }
      }
    ]);

    console.log("\n==============================================");
    console.log("  BLOODLINK SEED COMPLETED SUCCESSFULLY");
    console.log("==============================================");
    console.log(`- Blood Banks created: ${bloodBanks.length}`);
    console.log(`- Inventory records created: ${inventory.length}`);
    console.log(`- Donors created: ${donors.length}`);
    console.log(`- Hospitals created: ${hospitals.length}`);
    console.log("==============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;