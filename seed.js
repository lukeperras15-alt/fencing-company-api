// Patch for older Node.js versions
const nodeCrypto = require("crypto");
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = nodeCrypto.webcrypto;
}

const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/?replicaSet=rs0";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB...");
    const db = client.db("fenceCompanyDB");

    // 1. CLEAR EXISTING DATA
    // This prevents duplicate key errors and ensures a clean slate
    await db.collection("fences").deleteMany({});
    await db.collection("customers").deleteMany({});
    await db.collection("inventory").deleteMany({});
    await db.collection("orders").deleteMany({});
    console.log("Cleaned existing collections.");

    // 2. SEED FENCES (Catalog)
    await db.collection("fences").insertMany([
      { _id: 101, materialType: "6ft Cedar Privacy", pricePerFoot: 35.00 },
      { _id: 102, materialType: "4ft Vinyl Picket", pricePerFoot: 42.50 },
      { _id: 103, materialType: "5ft Galvanized Chainlink", pricePerFoot: 18.00 },
      { _id: 104, materialType: "6ft Black Ornamental Iron", pricePerFoot: 55.00 },
      { _id: 105, materialType: "8ft Commercial Chainlink", pricePerFoot: 25.00 },
      { _id: 106, materialType: "6ft White Vinyl Privacy", pricePerFoot: 45.00 }
    ]);

    // 3. SEED CUSTOMERS
    await db.collection("customers").insertMany([
      { _id: 1, firstName: "Sarah", lastName: "Jenkins", email: "s.jenkins@email.com" },
      { _id: 2, firstName: "Marcus", lastName: "Tremblay", email: "mtremblay88@email.com" },
      { _id: 3, firstName: "Linda", lastName: "Chen", email: "lchen.home@email.com" },
      { _id: 4, firstName: "David", lastName: "Miller", email: "dmiller_builds@email.com" },
      { _id: 5, firstName: "Emily", lastName: "Davis", email: "emily.davis99@email.com" }
    ]);

    // 4. SEED INVENTORY
    await db.collection("inventory").insertMany([
      { fenceId: 101, stockAvailable: 5000 },
      { fenceId: 102, stockAvailable: 3200 },
      { fenceId: 103, stockAvailable: 8500 },
      { fenceId: 104, stockAvailable: 1500 },
      { fenceId: 105, stockAvailable: 10000 },
      { fenceId: 106, stockAvailable: 2400 }
    ]);

    // 5. SEED ORDERS (Sample Entries)
    await db.collection("orders").insertMany([
      { _id: 5001, customerId: 1, fenceId: 101, totalLinearFeet: 120, orderDate: new Date("2026-03-15"), status: "Completed" },
      { _id: 5002, customerId: 2, fenceId: 104, totalLinearFeet: 85, orderDate: new Date("2026-03-28"), status: "In Progress" },
      { _id: 5003, customerId: 1, fenceId: 102, totalLinearFeet: 40, orderDate: new Date("2026-04-01"), status: "Quoted" }
    ]);

    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();