// here , we can do initialization of database

require("dotenv").config();
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("Connection error:", err);
    });


const initDB = async () => {
    // firstly, if there is already data present in db ,then clean it

    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        image: { url: obj.image.url, filename: obj.image.filename },
        owner: "69ee3a7aa7c542ae45cc8076",
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized.");
};

initDB();

