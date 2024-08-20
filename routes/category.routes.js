"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const {
  addCategory,
  getDetails,
  getLogs,
  deleteCategory,
  toggleStatus,
  updateCategory,
  getCategoryNames,
} = require("../controllers/category");

// @ADMIN ROUTES
router.get("/names", isAdmin, getCategoryNames);
router.post("/status/:id", isAdmin, toggleStatus);

// @CRUD for ADMIN
router.post("/", addCategory);
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.delete("/:id", isAdmin, deleteCategory);
router.post("/:id", isAdmin, updateCategory);

module.exports = router;
