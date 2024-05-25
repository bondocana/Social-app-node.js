const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts.js");
const commentRoute = require("./routes/comments.js");
const cookieParser = require("cookie-parser");

dotenv.config();

// mongoose.connect(process.env.MONGO_URL);

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// app.get("/", (req, res) => {
//   res.send("Welcome to homepage");
// });

// app.get("/users", (req, res) => {
//   res.send("Welcome to user page");
// });

app.listen(8800, () => {
  mongoose.connect(process.env.MONGO_URL);
  console.log("Backend server is running!");
});
