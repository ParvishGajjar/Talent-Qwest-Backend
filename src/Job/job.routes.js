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
  jobConversion,
  addJobPost,
  hrRoundOne,
  filterHrRoundOne,
  updateReviewRoundOne,
  hrRoundTwo,
  filterHrRoundTwo,
  updateReviewRoundTwo,
  updateJobPost,
  exportToCSV
} from "./job.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/apply-for-job/:jobId", isAuthenticated, applyForJob);
router.get("/open-job", isAuthenticated, openJob);
router.get("/closed-job", isAuthenticated, closedJob);
router.get("/applied-job", isAuthenticated, appliedJob);
router.get("/job-details/:jobId", isAuthenticated, getJobDetails);
router.get("/jobs-round-one", isAuthenticated, jobsRoundOne);
router.get("/jobs-round-two", isAuthenticated, jobsRoundTwo);
router.get("/user-status", isAuthenticated, getUserStatus);
router.post("/job-conversion/:jobId", isAuthenticated, jobConversion);
router.post("/add-job-post", isAuthenticated, addJobPost);
router.get("/hr-round-one", isAuthenticated, hrRoundOne);
router.get("/hr-round-two", isAuthenticated, hrRoundTwo);
router.get("/filter-hr-round-one", isAuthenticated, filterHrRoundOne);
router.get("/filter-hr-round-two", isAuthenticated, filterHrRoundTwo);
router.post("/update-review-one", isAuthenticated, updateReviewRoundOne);
router.post("/update-review-two", isAuthenticated, updateReviewRoundTwo);
router.post("/update-job-post/:jobId", isAuthenticated, updateJobPost);
router.post("/export-to-csv", isAuthenticated, exportToCSV)
module.exports = router;
