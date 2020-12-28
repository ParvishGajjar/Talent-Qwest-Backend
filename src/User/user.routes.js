/* eslint-disable no-undef */
import {
  signup,
  login,
  getAllUsers,
  emailVerify,
  pageOne,
  resendEmailLink
} from "./user.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
var router = express.Router();

router.post("/login", login);
router.get("/getusers", isAuthenticated, getAllUsers);
router.post("/page-one", isAuthenticated, pageOne)
router.post("/signup", signup);
router.get("/email-verify/:token", emailVerify)
router.post("/resend-email", resendEmailLink)

module.exports = router;