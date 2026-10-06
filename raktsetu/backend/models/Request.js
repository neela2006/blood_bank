const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  patient: { type: String, required: true, trim: true },
  hospital: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  units: { type: Number, required: true, min: 1 },
  city: { type: String, required: true, trim: true },
  urgency: { type: String, default: "Urgent" },
  contact: { type: String, default: "" },
  notes: { type: String, default: "" },
  status: { type: String, enum: ["Open", "Matched", "Fulfilled"], default: "Open" },
  createdAt: { type: Number, default: Date.now },
});

requestSchema.set("toJSON", {
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; },
});

module.exports = mongoose.model("Request", requestSchema);
