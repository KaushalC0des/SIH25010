const mongoose = require("mongoose");

// Define Farmer schema
const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true, // mobile number should be unique
  },
  password: {
    type: String,
    required: true,
  }
});

// Create model
const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;
