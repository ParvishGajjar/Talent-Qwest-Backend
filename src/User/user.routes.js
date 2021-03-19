/* eslint-disable no-undef */
import {
  signup,
  resendEmailLink,
  emailVerify,
  login,
  logout,
  signupTwo,
  signupThree,
  signupFour,
  signupFive,
  signupSix,
  signupSeven,
  signupEight,
  signupNine,
  forgetPassword,
} from "./user.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
var router = express.Router();

router.post("/signup", signup);
router.post("/resend-email", resendEmailLink);
router.get("/email-verify/:token", emailVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/signup-two", isAuthenticated, signupTwo);
router.post("/signup-three", isAuthenticated, signupThree);
router.post("/signup-four", isAuthenticated, signupFour);
router.post("/signup-five", isAuthenticated, signupFive);
router.post("/signup-six", isAuthenticated, signupSix);
router.post("/signup-seven", isAuthenticated, signupSeven);
router.post("/signup-eight", isAuthenticated, signupEight);
router.post("/signup-nine", isAuthenticated, signupNine);
router.post("/forget-password", forgetPassword)

module.exports = router;
