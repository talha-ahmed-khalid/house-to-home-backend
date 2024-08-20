"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");

const { getLogs, getDetails, toggleStatus, editUser, updatePassword } = require("../controllers/user");

// @ADMIN ROUTES
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.post("/status/:id", isAdmin, toggleStatus);

// @USER ROUTES
router.post("/update-password", isUser, updatePassword);
router.post("/:id", isUser, editUser);

module.exports = router;
