const express = require("express");

const auth = require("./auth.routes");
const admin = require("./admin.routes");
const user = require("./user.routes");
const salesRep = require("./salesRep.routes");
const category = require("./category.routes");
const attribute = require("./attribute.routes");
const product = require("./product.routes");
const promocode = require("./promocode.routes");
const feedback = require("./feedback.routes");

module.exports = function (app) {
  app.use(express.json());

  app.use("/api/v1/auth", auth);
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/category", category);
  app.use("/api/v1/user", user);
  app.use("/api/v1/salesRep", salesRep);
  app.use("/api/v1/attribute", attribute);
  app.use("/api/v1/product", product);
  app.use("/api/v1/promocode", promocode);

  app.use("/api/v1/feedback", feedback);
};
