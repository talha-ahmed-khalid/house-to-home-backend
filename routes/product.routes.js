"use strict";

const express = require("express");
const router = express.Router();

const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");

const {
  addProduct,
  getDetails,
  getLogs,
  deleteProduct,
  toggleStatus,
  updateProduct,
} = require("../controllers/product");

// @ADMIN ROUTES
router.post("/", addProduct);
router.get("/", isAdmin, getLogs);
router.get("/:id", isAdmin, getDetails);
router.delete("/:id", isAdmin, deleteProduct);
router.post("/:id", isAdmin, updateProduct);
router.post("/status/:id", isAdmin, toggleStatus);

// @USER ROUTES

router.get("/user/get-products", getLogs);

module.exports = router;
