/* eslint-disable no-undef */
import {
  updateBasicInformation,
  updateLocation,
  updateProfileData,
  updateSkillHobbyLanguage,
  updateEducationDetails,
  updateWorkExperience,
  updateProjectDetails,
  updatePatentDetails,
  updateCertificationDetails,
  updateSocialMediaDetails,
  updateSkills,
  updateHobbies,
  updateLanguages,
  updatePassword
} from "./profile.functions";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/update-basic-information", isAuthenticated, updateBasicInformation);
router.post("/update-location", isAuthenticated, updateLocation);
router.post("/update-profile-data", isAuthenticated, updateProfileData);
router.post("/update-skill-hobby-language", isAuthenticated, updateSkillHobbyLanguage);
router.post("/update-education-details", isAuthenticated, updateEducationDetails);
router.post("/update-work-experience", isAuthenticated, updateWorkExperience);
router.post("/update-project-details", isAuthenticated, updateProjectDetails);
router.post("/update-patent-details", isAuthenticated, updatePatentDetails);
router.post("/update-certification-details", isAuthenticated, updateCertificationDetails);
router.post("/update-social-media-details", isAuthenticated, updateSocialMediaDetails);
router.post("/update-skills", isAuthenticated, updateSkills)
router.post("/update-hobbies", isAuthenticated, updateHobbies)
router.post("/update-languages", isAuthenticated, updateLanguages)
router.post("/change-password", isAuthenticated, updatePassword)

module.exports = router;
