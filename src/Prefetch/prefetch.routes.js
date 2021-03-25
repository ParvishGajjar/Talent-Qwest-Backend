/* eslint-disable no-undef */
import express from "express";
import { isAuthenticated } from "../auth/authentication";
import {
  getCountry,
  getState,
  getCity,
  getUserLocation,
  getSkills,
  getHobbies,
  getServices,
  getLanguages,
  getQualifications,
  getFresherOrNot,
  viewMyProfile,
  getCodingLanguage,
  viewOthersProfile,
  fetchUsername,
  fetchJobPosition,
  fetchQuestionCount,
  getEnoughCodingLanguage
} from "./prefetch.functions";
var router = express.Router();

router.get("/getcountry", getCountry);
router.get("/getstate/:cid", getState);
router.get("/getcity/:sid", getCity);
router.get("/getlocation", isAuthenticated, getUserLocation);
router.get("/getskills", getSkills)
router.get('/getservices', getServices)
router.get("/gethobbies", getHobbies)
router.get('/getlanguages', getLanguages)
router.get('/getqualifications', getQualifications)
router.get('/getfresherornot', isAuthenticated,getFresherOrNot)
router.get('/view-profile/me', isAuthenticated, viewMyProfile)
router.get("/view-profile/:username", isAuthenticated, viewOthersProfile)
router.get("/getusername", fetchUsername)
router.get("/coding-language", isAuthenticated, getCodingLanguage)
router.get('/get-job-positions', isAuthenticated, fetchJobPosition)
router.get('/question-count', isAuthenticated, fetchQuestionCount)
router.get("/enough-coding-language", isAuthenticated, getEnoughCodingLanguage)

module.exports = router;