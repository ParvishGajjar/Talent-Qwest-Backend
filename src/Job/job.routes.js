/* eslint-disable no-undef */
import {
  applyForJob,
  closedJob,
  openJob,
  appliedJob,
  getJobDetails,
  jobsRoundOne,
  jobsRoundTwo,
  getUserStatus,
  jobConversion
} from "./job.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/apply-for-job/:jobId", isAuthenticated, applyForJob);
router.get("/open-job", isAuthenticated, openJob);
router.get("/closed-job", isAuthenticated, closedJob);
router.get("/applied-job", isAuthenticated, appliedJob);
router.get("/job-details/:jobId", isAuthenticated, getJobDetails)
router.get("/jobs-round-one", isAuthenticated, jobsRoundOne)
router.get("/jobs-round-two", isAuthenticated, jobsRoundTwo)
router.get("/user-status", isAuthenticated, getUserStatus)
router.post("/job-conversion/:jobId", isAuthenticated, jobConversion)

module.exports = router;
