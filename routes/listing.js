const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { storage } = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router.route("/")
.get(listingController.index)
.post(isLoggedIn, upload.single("listing[image]"), validateListing, listingController.createListing);

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(listingController.showListing)
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, listingController.updateListing)
.delete(isLoggedIn, isOwner, listingController.destroyListing);

router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;