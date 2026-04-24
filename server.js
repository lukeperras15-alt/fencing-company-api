const nodeCrypto = require("crypto");
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = nodeCrypto.webcrypto;
}

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(express.json());

const uri = "mongodb://127.0.0.1:27017/?replicaSet=rs0";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db("FinalProject");
  console.log("Connected to MongoDB");
}
connectDB().catch(console.error);


// ==========================================
// 1. POST: Create a new order
// ==========================================
app.post("/orders", async (req, res) => {
  try {
    const newOrder = req.body;
    // Basic validation to ensure an _id is provided
    if (!newOrder._id) {
      return res.status(400).json({ error: "Order must include an _id" });
    }
    
    const result = await db.collection("Orders").insertOne(newOrder);
    res.status(201).json({ message: "Order created successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
});

// ==========================================
// 2. GET: Retrieve all orders
// ==========================================
app.get("/orders", async (req, res) => {
  try {
    console.log("Attempting to fetch from collection...");
    // Make sure the name inside the quotes exactly matches your database collection
    const orders = await db.collection("Orders").find({}).toArray();
    res.status(200).json(orders);
  } catch (error) {
    // This will print the actual technical reason for the crash to your terminal
    console.error("GET Route Error:", error.message); 
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
});

// ==========================================
// 3. GET /ID: Retrieve a specific order
// ==========================================
app.get("/orders/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id); // Convert URL string parameter to Integer
    const order = await db.collection("Orders").findOne({ _id: orderId });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ==========================================
// 4. PUT: Update an existing order
// ==========================================
app.put("/orders/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const updateData = req.body;

    const result = await db.collection("Orders").updateOne(
      { _id: orderId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// ==========================================
// 5. DELETE: Remove an order
// ==========================================
app.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const result = await db.collection("Orders").deleteOne({ _id: orderId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});