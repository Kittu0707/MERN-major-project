const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });


app.get("/", (req,res) => {
    res.send("Hi i am root");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// for show route :- to parse the req data 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));


// INDEX ROUTE:-

app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});

})

//New Route:-
 app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
 })


// Show Route:-

app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
});

// Create Route:-
app.post("/listings", async(req,res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})

//Edit Route:-
app.get("/listings/:id/edit",async(req,res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});


//UPDATE Route:-
app.put("/listings/:id", async(req,res) => {
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})

//DELETE Route:-

app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

// req to path to save the data in DB:-

// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

    // we can save this sample listing in database:-

    // await sampleListing.save();
    // console.log("sample was saved");
    // res.send("successful testing");
//});


app.listen(8080, () => {
    console.log("server is listening at the port 8080");
});

