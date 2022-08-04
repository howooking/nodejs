const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const {
  renderRegister,
  createUser,
  renderLogin,
  login,
  logout,
} = require("../controllers/users");

router.route("/register").get(renderRegister).post(catchAsync(createUser));

router
  .route("/login")
  .get(renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
