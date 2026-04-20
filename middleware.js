const Joi = require("joi");
const ExpressError = require("./utils/ExpressError.js");

// Joi schema for listing validation
const listingSchema = Joi.object({
    listing: Joi.object({
        title:       Joi.string().required(),
        description: Joi.string().required(),
        image:       Joi.string().uri().allow("", null),
        price:       Joi.number().min(0).required(),
        location:    Joi.string().required(),
        country:     Joi.string().required(),
    }).required(),
});

// Middleware — validates req.body before create / update routes
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, message));
    }
    next();
};

// Joi schema for review validation
const reviewSchema = Joi.object({
    review: Joi.object({
        rating:  Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});

// Middleware — validates req.body before review create route
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, message));
    }
    next();
};

module.exports = { validateListing, validateReview };
