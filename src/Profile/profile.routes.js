/* eslint-disable no-undef */
import {
  updateBasicInformation,
  updateLocation,
  updateProfileData,
  updateSkillHobbyLanguage,
  updateFive,
  updateSix,
  updateSeven,
  updateEight,
  updateNine,
} from "./profile.functions";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/update-basic-information", isAuthenticated, updateBasicInformation);
router.post("/update-location", isAuthenticated, updateLocation);
router.post("/update-profile-data", isAuthenticated, updateProfileData);
router.post("/update-skill-hobby-language", isAuthenticated, updateSkillHobbyLanguage);
router.post("/update-five", isAuthenticated, updateFive);
router.post("/update-six", isAuthenticated, updateSix);
router.post("/update-seven", isAuthenticated, updateSeven);
router.post("/update-eight", isAuthenticated, updateEight);
router.post("/update-nine", isAuthenticated, updateNine);

module.exports = router;
