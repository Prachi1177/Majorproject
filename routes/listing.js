const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../../cloudconfig.js");
const upload = multer({ storage });

// All Listings
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Listing
router.get("/:id", wrapAsync(listingController.showListing));

// Create Listing
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// Edit Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
