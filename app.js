"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const multer = require("multer");
const https = require("https");
const fs = require("fs");

const connectDB = require("./config/database");
const multer_config = require("./config/multer");

// SSL Configuration
const local = true;
let credentials = {};

if (local) {
  credentials = {
    key: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.key", "utf8"),
    cert: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.crt", "utf8"),
    ca: fs.readFileSync("/etc/apache2/ssl/onlinetestingserver.ca"),
  };
} else {
  credentials = {
    key: fs.readFileSync("../certs/ssl.key"),
    cert: fs.readFileSync("../certs/ssl.crt"),
    ca: fs.readFileSync("../certs/ca-bundle"),
  };
}

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use("/media", express.static(__dirname + "/media"));
app.use(helmet());
app.use(logger("dev"));
app.use(cors());
app.use(
  multer({
    storage: multer_config.fileStorage,
    fileFilter: multer_config.fileFilter,
  }).fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "mainImage",
      maxCount: 1,
    },
  ])
);

// @Routes
require("./routes")(app);

// SCRIPT ROUTE
// app.get("/api/v1/script/", runScript);

// @Error Handling
app.use((error, req, res, next) => {
  console.log("*********************************************************************");
  console.log(error);
  console.log("*********************************************************************");
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connectDB();
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT, () => {
  console.log("\u001b[" + 34 + "m" + `Server started on port: ${process.env.PORT}` + "\u001b[0m");
});
