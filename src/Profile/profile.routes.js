/* eslint-disable no-undef */
import {
  updateOne,
  updateTwo,
  updateThree,
  updateFour,
  updateFive,
  updateSix,
  updateSeven,
  updateEight,
  updateNine,
} from "./profile.functions";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/update-one", isAuthenticated, updateOne);
router.post("/update-two", isAuthenticated, updateTwo);
router.post("/update-three", isAuthenticated, updateThree);
router.post("/update-four", isAuthenticated, updateFour);
router.post("/update-five", isAuthenticated, updateFive);
router.post("/update-six", isAuthenticated, updateSix);
router.post("/update-seven", isAuthenticated, updateSeven);
router.post("/update-eight", isAuthenticated, updateEight);
router.post("/update-nine", isAuthenticated, updateNine);

module.exports = router;
