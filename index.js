/* eslint-disable no-undef */
import express from "express";
// import * as api from './apifunctions.js'
import mysql from "mysql";
const util = require("util");
var app = express();
app.use(express.json());

const locationapis = require("./Users/UserLocation/locationroutes.js");
const similarplatformapis = require("./Users/UserPlatform/platformroutes.js");
const professionapis = require("./Users/UserProfession/professionroutes.js");
const wageskillsapis = require("./Users/UserWageSkill/wageskillroutes.js");
const userauthapis = require("./Users/UserAuth/authroutes");

var connection = mysql.createConnection({
  host: "13.235.170.141",
  user: "testuser",
  password: "testuser",
  database: "talentQwest",
  port: "3306",
});

global.connection = connection;

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

export const query = util.promisify(connection.query).bind(connection);

app.use("/api", userauthapis);
app.use("/api/location", locationapis);
app.use("/api/similarplatform", similarplatformapis);
app.use("/api/profession", professionapis);
app.use("/api/pagefour", wageskillsapis);

app.listen(3400, (err) => {
  if (err) {
    return console.log("Error: " + err);
  }
  console.log(`Server is listening on port 3000`);
});
