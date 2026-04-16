// here , we can do initialization of database

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });


const initDB = async () => {
    // firstly, if there is already data present in db ,then clean it

    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialized.");
};

initDB();