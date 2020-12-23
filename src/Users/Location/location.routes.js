/* eslint-disable no-undef */
import express from "express";
import { isAuthenticated } from "../../auth/authentication";
import {
  getCountry,
  getState,
  getCity,
  getUserLocation,
  insertUserLocation,
  updateUserLocation,
} from "./location.functions";
var router = express.Router();

router.get("/getcountry", getCountry);
router.get("/getstate/:cid", getState);
router.get("/getcity/:sid", getCity);
router.get("/getlocation", isAuthenticated, getUserLocation);
router.post("/insertlocation", insertUserLocation);
router.post("/updatelocation", isAuthenticated, updateUserLocation);

module.exports = router;
