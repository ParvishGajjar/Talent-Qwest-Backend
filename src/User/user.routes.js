/* eslint-disable no-undef */
import {
  signup,
  login,
  getUsers,
  insertUserLocation,
  updateUserLocation,
  emailVerify,
} from "./user.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
var router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/email-verify/:id", emailVerify)
router.get("/getusers", isAuthenticated, getUsers);
router.post("/insertlocation", insertUserLocation);
router.post("/updatelocation", isAuthenticated, updateUserLocation);

module.exports = router;
