const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true, unique: true },
  units: { type: Number, default: 0, min: 0 },
});

module.exports = mongoose.model("Stock", stockSchema);
