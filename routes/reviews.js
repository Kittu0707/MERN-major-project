const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn } = require("../middleware2.js");
const { validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// CREATE REVIEW
router.post("/", isloggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW
router.delete("/:reviewId", isloggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;
