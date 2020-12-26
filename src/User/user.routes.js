/* eslint-disable no-undef */
import {
  signup,
  login,
  getAllUsers,
} from "./user.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
var router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.post("/email-verify", emailVerify)
router.get("/getusers", isAuthenticated, getAllUsers);
// router.post("/page-one", isAuthenticated, pageOne)

module.exports = router;