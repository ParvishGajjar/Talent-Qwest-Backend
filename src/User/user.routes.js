/* eslint-disable no-undef */
import {
  signup,
  login,
  getAllUsers,
  emailVerify,
  signupTwo,
  resendEmailLink,
  signupThree,
  signupFour,
} from "./user.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
var router = express.Router();

router.post("/login", login);
router.get("/getusers", isAuthenticated, getAllUsers);
router.post("/signup-two", isAuthenticated, signupTwo);
router.post("/signup", signup);
router.get("/email-verify/:token", emailVerify);
router.post("/resend-email", resendEmailLink);
router.post("/signup-three", isAuthenticated, signupThree);
router.post("/signup-four", isAuthenticated, signupFour);

module.exports = router;