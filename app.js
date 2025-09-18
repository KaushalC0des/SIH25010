const express = require("express");
const mongoose = require("mongoose");
const Farmer = require("./Schema/farmer");
const farmersData = require("./init/data");
const path = require("path");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json());
app.use(express.static(path.join(__dirname, "public","home_page"))); // Serve static files

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/farmer";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
    await initializeData(); // Preload data if collection is empty
  } catch (err) {
    console.log("❌ DB Connection Error:", err);
  }
}

// Initialize data (one-time)
async function initializeData() {
  const count = await Farmer.countDocuments();
  if (count === 0) {
    await Farmer.insertMany(farmersData);
    console.log("✅ Initial farmer data added to DB");
  } else {
    console.log("ℹ Farmer data already exists");
  }
}

main()
// Define routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home_page", "index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login_page", "index.html"));
});

  
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

