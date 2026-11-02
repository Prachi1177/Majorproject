const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapasync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapasync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapasync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapasync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(listingController.renderEditForm));

module.exports = router;
