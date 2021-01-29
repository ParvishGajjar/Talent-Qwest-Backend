/* eslint-disable no-undef */
import {
    getRoundOne
  } from "./rounds.functions.js";
  import express from "express";
  import { isAuthenticated } from "../auth/authentication.js";
  var router = express.Router();
  
  router.get("/round-one", getRoundOne);
  
  module.exports = router;