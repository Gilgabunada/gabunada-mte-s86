const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const app = express();

const user = require("./routes/user.js");
const movie = require("./routes/movie.js");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173","gabunada-mte-88.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("Connected to MongoDB Atlas"));

app.use("/users", user);
app.use("/movies", movie);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port ${process.env.PORT || 3000}`);
  });
}

module.exports = app;