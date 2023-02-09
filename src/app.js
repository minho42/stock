require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const journalRoutes = require("./routes/journalRoutes");
const yahooDataRoutes = require("./routes/yahooDataRoutes");
const ownedStockRoutes = require("./routes/ownedStockRoutes");

const app = express();

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self' *.investingjournals.com; connect-src 'self' *.investingjournals.com; style-src-elem 'self' *.fonts.googleapis.com; "
//   );
//   next();
// });

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use(userRoutes);
app.use(journalRoutes);
app.use(yahooDataRoutes);
app.use(ownedStockRoutes);

// app.get("", (req, res) => {
//   res.send({
//     data: "It's working!",
//   });
// });

// app.get("*", (req, res) => {
//   res.status(404).send({
//     error: "404 Not Found",
//   });
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

module.exports = app;
