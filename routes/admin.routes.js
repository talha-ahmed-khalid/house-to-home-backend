"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const { me, updateAdmin, updatePassword } = require("../controllers/admin");

// @ADMIN ROUTES
router.get("/", isAdmin, me);
router.post("/", isAdmin, updateAdmin);
router.post("/update-password", isAdmin, updatePassword);

module.exports = router;
