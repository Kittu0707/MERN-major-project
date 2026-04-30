const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner } = require("../middleware2.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


 const multer = require('multer');
 const {storage} = require("../cloudConfig.js");
 const upload = multer({ storage });


// INDEX + CREATE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// NEW FORM
router.get("/new", isloggedIn, listingController.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedIn, wrapAsync(isOwner), validateListing, wrapAsync(listingController.updateListing))
    .delete(isloggedIn, wrapAsync(isOwner), wrapAsync(listingController.destroyListing));

// EDIT FORM
router.get("/:id/edit", isloggedIn, wrapAsync(isOwner), wrapAsync(listingController.renderEditForm));

module.exports = router;
