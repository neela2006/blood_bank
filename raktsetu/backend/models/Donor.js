const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 65 },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
  bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  city: { type: String, required: true, trim: true },
  email: { type: String, default: "" },
  lastDonated: { type: String, default: "" },
  available: { type: Boolean, default: true },
  registeredAt: { type: Number, default: Date.now },
});

donorSchema.set("toJSON", {
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; },
});

module.exports = mongoose.model("Donor", donorSchema);
