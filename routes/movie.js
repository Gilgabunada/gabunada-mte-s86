const express = require("express");
const router = express.Router();
const movie = require("../controllers/movie");
const { verifyToken, verifyAdmin } = require("../auth.js");

router.post("/addMovie", verifyToken, verifyAdmin, movie.addMovie);
router.get("/getMovies", movie.getAllMovies);
router.get("/getMovie/:id", movie.getMovieById);
router.patch("/updateMovie/:id", verifyToken, verifyAdmin, movie.updateMovie);
router.delete("/deleteMovie/:id", verifyToken, verifyAdmin, movie.deleteMovie);
router.patch("/addComment/:id", verifyToken, movie.addMovieComment);
router.get("/getComments/:id", movie.getMovieComments);

module.exports = router;