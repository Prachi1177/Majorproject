const express = require("express");
const router = express.Router({ mergeParams: true });
router.get("/", (req, res) => { res.send("Review route"); });
module.exports = router;