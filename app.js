const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");


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


// req to path to save the data in DB:-

app.get("/testListing", async(req,res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    // we can save this sample listing in database:-

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});


app.listen(8080, () => {
    console.log("server is listening at the port 8080");
});

