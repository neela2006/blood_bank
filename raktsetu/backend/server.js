require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/raktsetu";

app.use(cors());
app.use(express.json());

// API
app.use("/api", apiRoutes);

// Serve the front end (the parent folder) so you can open http://localhost:5000
app.use(express.static(path.join(__dirname, "..")));

// Error handler
app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected:", MONGO_URI.replace(/\/\/.*@/, "//***@"));
    app.listen(PORT, () => console.log(`RaktSetu running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
