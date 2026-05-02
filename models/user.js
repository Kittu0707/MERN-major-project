const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// passportLocalMongoose - it will automatically define the username & password.

userSchema.plugin(passportLocalMongoose);    // it will automatically involve hasing and salting. 

module.exports = mongoose.model('User', userSchema);