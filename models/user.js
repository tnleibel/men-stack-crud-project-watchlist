const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    posterPath: String,
    isWatched: Boolean,
    genre: String,
    director: String,
    yearReleased: String,
    notes: String,
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    watchlist: [movieSchema]
})

const User = mongoose.model("User", userSchema)

module.exports = User