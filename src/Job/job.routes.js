/* eslint-disable no-undef */
import { applyForJob, openJob } from "./job.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";

var router = express.Router();

router.post("/apply-for-job/:jobId", isAuthenticated, applyForJob);
router.post("/open-job", isAuthenticated, openJob);

module.exports = router;
