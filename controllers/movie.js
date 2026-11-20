const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Add movie (Admin) -> returns 201 Created with the movie document
module.exports.addMovie = async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;

    const newMovie = new Movie({
      title,
      director,
      year,
      description,
      genre,
      comments: [],
    });

    const savedMovie = await newMovie.save();
    return res.status(201).json(savedMovie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error.", error: err.message });
    }
    return res.status(500).json({ message: "Error adding movie.", error: err.message });
  }
};

// Get all movies
module.exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    return res.status(200).json({ movies });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving movies.", error: err.message });
  }
};

// Get single movie 
module.exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving movie.", error: err.message });
  }
};

// Update movie by ID (Admin) 
module.exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }

    const { title, director, year, description, genre } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (director !== undefined) updates.director = director;
    if (year !== undefined) updates.year = year;
    if (description !== undefined) updates.description = description;
    if (genre !== undefined) updates.genre = genre;

    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    return res.status(200).json({
      message: "Movie updated successfully.",
      updatedMovie,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error updating movie.", error: err.message });
  }
};

// Delete movie by ID (Admin) 
module.exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }

    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    return res.status(200).json({ message: "Movie deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting movie.", error: err.message });
  }
};

// Add comment to a movie
module.exports.addMovieComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    movie.comments.push({
      userId: req.user.id,
      comment: comment.trim(),
    });

    const updatedMovie = await movie.save();
    return res.status(200).json({
      message: "Comment added successfully.",
      updatedMovie,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error adding comment.", error: err.message });
  }
};

// Get comments for a movie 
module.exports.getMovieComments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid movie ID." });
    }

    const movie = await Movie.findById(id).select("comments");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    return res.status(200).json({ comments: movie.comments });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving comments.", error: err.message });
  }
};