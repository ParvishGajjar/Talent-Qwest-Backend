/* eslint-disable no-undef */
import {
  getRoundOne,
  fetchRoundOne,
  fetchRoundOneQuestionnaire,
  updateRoundOne,
  addQuestionnaireRoundOne,
  uploadCodeSnippetRoundTwo,
} from "./rounds.functions.js";
import express from "express";
import { isAuthenticated } from "../auth/authentication.js";
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
var router = express.Router();

router.post("/round-one/:job_id", isAuthenticated, getRoundOne);
router.post("/round-one", isAuthenticated, fetchRoundOne);
router.get("/roundone/:jobId", isAuthenticated, fetchRoundOneQuestionnaire);
router.post("/update-round-one", isAuthenticated, updateRoundOne);
router.post(
  "/addquestions-round-one",
  isAuthenticated,
  addQuestionnaireRoundOne
);
router.post(
  "/upload-code-snippet",
  [isAuthenticated, upload.single("code-snippet")],
  uploadCodeSnippetRoundTwo
);

module.exports = router;
