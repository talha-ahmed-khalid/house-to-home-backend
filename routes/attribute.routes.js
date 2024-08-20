"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const {
  addAttribute,
  getDetails,
  getLogs,
  deleteAttribute,
  toggleStatus,
  updateAttribute,
  getAttributeNames,
} = require("../controllers/attribute");

// @ADMIN ROUTES
router.get("/names", isAdmin, getAttributeNames);
router.post("/", addAttribute);
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.post("/:id", isAdmin, updateAttribute);
router.delete("/:id", isAdmin, deleteAttribute);
router.post("/status/:id", isAdmin, toggleStatus);

module.exports = router;
