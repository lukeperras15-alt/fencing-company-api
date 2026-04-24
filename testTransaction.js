const nodeCrypto = require("crypto");
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = nodeCrypto.webcrypto;
}

const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/?replicaSet=rs0"; 

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    
    const db = client.db("FinalProject");

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        
        const newOrderId = Math.floor(Math.random() * 10000) + 6000;
        
        await db.collection("Orders").insertOne(
          {
            _id: newOrderId,
            customerId: 1,
            fenceId: 101,
            totalLinearFeet: 120,
            orderDate: new Date(),
            status: "Scheduled"
          },
          { session } 
        );

        const inventoryUpdate = await db.collection("Inventory").updateOne(
          { fenceId: 101, stockAvailable: { $gte: 120 } },
          { $inc: { stockAvailable: -120 } },
          { session } 
        );

        if (inventoryUpdate.modifiedCount === 0) {
          throw new Error("Insufficient inventory stock.");
        }

        console.log(`Success! Order ${newOrderId} placed and inventory updated.`);
      });
      
    } catch (transactionError) {
      console.error("Transaction rolled back:", transactionError.message);
    } finally {
      await session.endSession();
    }

  } finally {
    await client.close();
  }
}

run().catch(console.dir);