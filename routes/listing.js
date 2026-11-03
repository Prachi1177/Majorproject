const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
});

router.get("/new", isLoggedIn, (req, res) => {
  return res.render("listings/new.ejs");
});

router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/show.ejs", { listing });
});

router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  return res.redirect("/listings");
});

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  return res.render("listings/edit.ejs", { listing, originalImageUrl });
});

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  return res.redirect(`/listings/${id}`);
});

router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  return res.redirect("/listings");
});

module.exports = router;