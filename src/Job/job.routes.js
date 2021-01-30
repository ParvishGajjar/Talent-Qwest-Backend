/* eslint-disable no-undef */
import {
  applyForJob,
  closedJob,
  openJob,
  appliedJob,
} from "./job.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/apply-for-job/:jobId", isAuthenticated, applyForJob);
router.get("/open-job", isAuthenticated, openJob);
router.get("/closed-job", isAuthenticated, closedJob);
router.get("/applied-job", isAuthenticated, appliedJob);

module.exports = router;
