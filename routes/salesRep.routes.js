"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const { addSalesRep, getLogs, getDetails, toggleStatus, editSalesRep } = require("../controllers/salesRep");

// @ADMIN ROUTES
router.post("/", isAdmin, addSalesRep);
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.post("/:id", isAdmin, editSalesRep);
router.post("/status/:id", isAdmin, toggleStatus);

module.exports = router;
