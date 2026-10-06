const express = require("express");
const Donor = require("../models/Donor");
const Request = require("../models/Request");
const Stock = require("../models/Stock");
const Message = require("../models/Message");

const router = express.Router();

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CAN_DONATE_TO = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cityRegex = (city) => new RegExp("^" + escapeRegex(city) + "$", "i");

// wrap async handlers so errors reach the error middleware
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ---------- Donors ----------
router.get("/donors", wrap(async (req, res) => {
  const { bloodGroup, city, onlyAvailable } = req.query;
  const filter = {};
  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (city) filter.city = cityRegex(city);
  if (onlyAvailable === "true") filter.available = true;
  res.json(await Donor.find(filter).sort({ registeredAt: -1 }));
}));

router.get("/donors/compatible", wrap(async (req, res) => {
  const { bloodGroup, city } = req.query;
  if (!BLOOD_GROUPS.includes(bloodGroup)) return res.status(400).json({ error: "Invalid bloodGroup" });
  const eligible = BLOOD_GROUPS.filter((g) => CAN_DONATE_TO[g].includes(bloodGroup));
  const filter = { bloodGroup: { $in: eligible }, available: true };
  if (city) filter.city = cityRegex(city);
  res.json(await Donor.find(filter).sort({ registeredAt: -1 }));
}));

router.post("/donors", wrap(async (req, res) => {
  const donor = await Donor.create(req.body);
  res.status(201).json(donor);
}));

// ---------- Blood requests ----------
router.get("/requests", wrap(async (_req, res) => {
  res.json(await Request.find().sort({ createdAt: -1 }));
}));

router.post("/requests", wrap(async (req, res) => {
  const doc = await Request.create(req.body);
  res.status(201).json(doc);
}));

router.patch("/requests/:id", wrap(async (req, res) => {
  const doc = await Request.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true, runValidators: true }
  );
  if (!doc) return res.status(404).json({ error: "Request not found" });
  res.json(doc);
}));

// ---------- Stock ----------
router.get("/stock", wrap(async (_req, res) => {
  const rows = await Stock.find();
  const stock = {};
  BLOOD_GROUPS.forEach((g) => (stock[g] = 0));
  rows.forEach((r) => (stock[r.bloodGroup] = r.units));
  res.json(stock);
}));

router.patch("/stock/:group", wrap(async (req, res) => {
  const delta = Number(req.body.delta) || 0;
  const row = await Stock.findOneAndUpdate(
    { bloodGroup: req.params.group }, { $inc: { units: delta } }, { new: true, upsert: true }
  );
  if (row.units < 0) { row.units = 0; await row.save(); }
  res.json(row);
}));

// ---------- Contact ----------
router.post("/contact", wrap(async (req, res) => {
  await Message.create(req.body);
  res.status(201).json({ ok: true });
}));

module.exports = router;
