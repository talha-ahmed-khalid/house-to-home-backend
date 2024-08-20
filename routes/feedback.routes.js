"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const { getDetails, getLogs, submitFeedback } = require("../controllers/feedback");

// @GENERAL ROUTES
router.post("/submit", submitFeedback);

// @ADMIN ROUTES
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);

module.exports = router;
