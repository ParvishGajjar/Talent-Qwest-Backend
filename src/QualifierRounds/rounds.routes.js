/* eslint-disable no-undef */
import {
    getRoundOne,
    fetchRoundOne,
    fetchRoundOneQuestionnaire
  } from "./rounds.functions.js";
  import express from "express";
  import { isAuthenticated } from "../auth/authentication.js";
  var router = express.Router();
  
  router.post("/round-one/:job_id",isAuthenticated, getRoundOne);
  router.post("/round-one", isAuthenticated, fetchRoundOne);
  router.get("/roundone/:jobId", isAuthenticated, fetchRoundOneQuestionnaire)
  
  module.exports = router;