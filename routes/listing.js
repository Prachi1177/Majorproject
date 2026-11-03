const express = require("express");
const router = express.Router();

// WrapAsync - small/capital donhi try karel
let wrapAsync;
try { wrapAsync = require("../utils/wrapAsync.js"); } 
catch (e) { wrapAsync = require("../utils/WrapAsync.js"); }

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// controller - controller / controllers donhi try karel
let listingController;
try { listingController = require("../controller/listing.js"); } 
catch (e) { listingController = require("../controllers/listing.js"); }

const multer = require("multer");

// cloudconfig - donhi spelling try
let storage;
try { storage = require("../cloudconfig.js").storage; } 
catch (e) { storage = require("../cloudConfig.js").storage; }

const upload = multer({ storage });

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
