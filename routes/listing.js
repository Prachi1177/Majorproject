const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

// Index - sagle listings dakhvel
router.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
});

// Show - ek listing dakhvel
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("owner");
    if (!listing) {
      req.flash("error", "Not found");
      return res.redirect("/listings");
    }
    return res.render("listings/show.ejs", { listing });
  } catch (err) {
    return res.redirect("/listings");
  }
});

module.exports = router;