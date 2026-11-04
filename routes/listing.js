const express = require("express");
const router = express.Router();

const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");

// cloudConfig ithech - baherchi file nako
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "wanderlust_DEV", allowedFormats: ["png", "jpg", "jpeg"] },
});
const upload = multer({ storage });

router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.route("/:id").get(wrapAsync(listingController.showListing)).put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)).delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
module.exports = router;