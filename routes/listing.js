const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("reviews").populate("owner");
    if (!listing) {
      return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { listing });
  } catch (e) {
    return res.redirect("/listings");
  }
});

module.exports = router;