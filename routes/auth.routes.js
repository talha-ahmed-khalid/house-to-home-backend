"use strict";

const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/auth");

const isAdmin = require("../middlewares/isAdmin");
const isUser = require("../middlewares/isUser");

// @ADMIN ROUTES
router.put("/register-admin", registerAdmin);
router.post("/login-admin", loginAdmin);
router.get("/admin", isAdmin, getAdmin);

// @USER ROUTES
router.put("/register", registerUser);
router.post("/login", loginUser);
router.get("/", isUser, getUser);

// @GENERAL ROUTES
router.post("/recover", recoverPassword);
router.post("/verify", verifyRecoverCode);
router.post("/reset", resetPassword);

module.exports = router;
