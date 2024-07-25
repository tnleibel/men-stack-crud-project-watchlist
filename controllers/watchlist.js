const express = require("express")

const router = express.Router()

const User = require("../models/user.js")

router.get("/", async (req, res) => {
    try{
        const currentUser = await User.findById(req.session.user._id)
        res.render("watchlist/index.ejs", {
            watchlist: currentUser.watchlist,
            currentUserId: req.session.user._id
        })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/new", async (req, res) => {
    res.render("watchlist/new.ejs")
})

router.post("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        if(req.body.isWatched === "on") {
            req.body.isWatched = true
        } else {
            req.body.isWatched = false
        }
        currentUser.watchlist.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/watchlist`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:movieId", async (req, res) => {
    const currentUser = await User.findById(req.session.user._id)
    const movie = currentUser.watchlist.id(req.params.movieId)
    res.render("watchlist/show.ejs", {
        movie: movie
    })
})

router.delete("/:movieId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.watchlist.id(req.params.movieId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/watchlist`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:movieId/posters", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const movie = currentUser.watchlist.id(req.params.movieId)
        const url = `https://api.themoviedb.org/3/search/movie?query=${movie.name}&include_adult=false&language=en-US&page=1`
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`
            }
        };
        const getPosters = async () => {
            const response = await fetch(url, options)
            const jsonResponse = await response.json()
            if(jsonResponse === null) {
                return []
            }
            const posters = jsonResponse.results.map(movie => movie.poster_path)
            return posters
        }
        const posterResults = await getPosters()
        res.render("watchlist/posters.ejs", {
            movie: movie,
            posters: posterResults
            
        })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:movieId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const movie = currentUser.watchlist.id(req.params.movieId)
        res.render("watchlist/edit.ejs", {
            movie: movie
        })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.put("/:movieId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const movie = currentUser.watchlist.id(req.params.movieId)
        if(req.body.isWatched === "on") {
            req.body.isWatched = true
        } else {
            req.body.isWatched = false
        }
        movie.set(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/watchlist/${req.params.movieId}`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router