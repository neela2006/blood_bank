// Fills the database with demo data. Run: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Donor = require("./models/Donor");
const Request = require("./models/Request");
const Stock = require("./models/Stock");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CITIES = ["Tirunelveli", "Chennai", "Madurai", "Coimbatore", "Trichy", "Nagercoil", "Tuticorin"];
const FIRST = ["Arun","Divya","Karthik","Meena","Suresh","Priya","Ravi","Lakshmi","Vijay","Anitha","Bala","Kavitha","Mohan","Sangeetha","Dinesh","Nithya","Ganesh","Revathi","Prakash","Deepa"];
const LAST = ["Kumar","Raj","Nair","Pillai","Iyer","Krishnan","Murugan","Selvam","Devi","Shankar"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const DAY = 86400000;

(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/raktsetu");
  await Promise.all([Donor.deleteMany({}), Request.deleteMany({}), Stock.deleteMany({})]);

  const donors = Array.from({ length: 24 }, () => ({
    name: pick(FIRST) + " " + pick(LAST),
    bloodGroup: pick(BLOOD_GROUPS),
    age: 20 + Math.floor(Math.random() * 35),
    gender: pick(["Male", "Female"]),
    city: pick(CITIES),
    phone: "9" + Math.floor(100000000 + Math.random() * 899999999),
    lastDonated: `${2024 + Math.floor(Math.random() * 2)}-0${1 + Math.floor(Math.random() * 8)}-1${Math.floor(Math.random() * 8)}`,
    available: Math.random() > 0.22,
    registeredAt: Date.now() - Math.floor(Math.random() * 60 * DAY),
  }));
  await Donor.insertMany(donors);

  await Request.insertMany([
    { patient: "K. Selvaraj", hospital: "GH Tirunelveli", bloodGroup: "O-", units: 2, city: "Tirunelveli", urgency: "Critical", status: "Open", createdAt: Date.now() - 40 * 60000 },
    { patient: "R. Meenakshi", hospital: "Apollo Madurai", bloodGroup: "B+", units: 1, city: "Madurai", urgency: "Urgent", status: "Matched", createdAt: Date.now() - 5 * 3600000 },
    { patient: "S. Ilango", hospital: "KMCH Coimbatore", bloodGroup: "AB+", units: 3, city: "Coimbatore", urgency: "Scheduled", status: "Fulfilled", createdAt: Date.now() - DAY },
  ]);

  await Stock.insertMany(BLOOD_GROUPS.map((g) => ({ bloodGroup: g, units: Math.floor(Math.random() * 40) + 4 })));

  console.log("Seeded: 24 donors, 3 requests, 8 stock rows");
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
