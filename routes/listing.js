const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Listing route working - Main site Live");
});

module.exports = router;