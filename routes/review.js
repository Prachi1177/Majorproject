const express = require("express");
const router = express.Router({ mergeParams: true });

let wrapAsync;
try { wrapAsync = require("../utils/wrapAsync.js"); } 
catch (e) { wrapAsync = require("../utils/WrapAsync.js"); }

let ExpressError;
try { ExpressError = require("../utils/ExpressError.js"); }
catch (e) { ExpressError = require("../utils/expressError.js"); }

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// controller / controllers donhi try
let reviewController;
try { reviewController = require("../controller/review.js"); }
catch (e) { reviewController = require("../controllers/review.js"); }

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
