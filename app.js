const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRouter = require("./routes/user.js");

const {isloggedIn, isOwner} = require("./middleware2.js");

// for error handling & middleware 
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { validateListing, validateReview } = require("./middleware.js");
const req = require("express/lib/request.js");



mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
    secret: "supersecret",
    resave: false,
    saveUninitialised: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.get("/", (req,res) => {
    res.send("Hi i am root");
});

app.use(session(sessionOptions));
app.use(flash());

// middleware that initialize passport (passport also need sessions):-

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/", userRouter);


// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "demo@gmail.com",
//         username: "demouserr",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })


// INDEX ROUTE
app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// NEW ROUTE
app.get("/listings/new", isloggedIn,  (req,res) => {
    res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req,res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist !");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// CREATE ROUTE
app.post("/listings", isloggedIn, validateListing, wrapAsync(async(req,res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
}));

// EDIT ROUTE
app.get("/listings/:id/edit",isloggedIn, isOwner, wrapAsync(async(req,res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing not found!"));
    }
    res.render("listings/edit.ejs", { listing });
}));

// UPDATE ROUTE
app.put("/listings/:id",isloggedIn, isOwner, validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
}));

// validateListing is used as a middleware to detect bad data  & wrapAsync is used for error handling prevents app crash .

// DELETE ROUTE
app.delete("/listings/:id",isloggedIn,isOwner, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted !");

    res.redirect("/listings");
}));


// REVIEW CREATE ROUTE
app.post("/listings/:id/reviews", isloggedIn, validateReview, wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${req.params.id}`);
}));

// REVIEW DELETE ROUTE
app.delete("/listings/:id/reviews/:reviewId", isloggedIn, wrapAsync(async(req,res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted !");

    res.redirect(`/listings/${id}`);
}));

// 404 — no route matched
app.all("*splat", (_req, _res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// Global error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});


app.listen(8080, () => {
    console.log("server is listening at the port 8080");
});
