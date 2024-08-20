const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Auth = require("../models/Auth");
const ResetToken = require("../models/ResetToken");

exports.generateHash = async (string) => await bcrypt.hash(string, 12);

exports.generateToken = async (email, userId, secret, scope) => jwt.sign({ email, userId, scope }, secret);

exports.getUserForAuth = async (email) =>
  await Auth.findOne({ email: email.toLowerCase() }).populate("adminAuth userAuth");

exports.createPasswordResetToken = async (email, code) => {
  const token = await ResetToken.findOne({ email });
  if (token) await token.remove();
  const newToken = new ResetToken({
    email,
    code,
  });
  await newToken.save();
};

exports.comparePasswordResetToken = async (code, email) => await ResetToken.findOne({ code, email });
