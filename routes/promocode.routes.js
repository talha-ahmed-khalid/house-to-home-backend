"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");

const {
  addPromoCode,
  getDetails,
  getLogs,
  deletePromoCode,
  toggleStatus,
  updatePromoCode,
} = require("../controllers/promoCode");

// @ADMIN ROUTES
router.post("/", addPromoCode);
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.delete("/:id", isAdmin, deletePromoCode);
router.post("/:id", isAdmin, updatePromoCode);
router.post("/status/:id", isAdmin, toggleStatus);

module.exports = router;
