/* eslint-disable no-undef */
import express from "express";
// import * as api from './apifunctions.js'
import mysql from "mysql";
const util = require("util");
var app = express();
app.use(express.json());

const userroutes = require("./User/user.routes");
const prefetchroutes = require("./Prefetch/prefetch.routes");

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

app.use("/api/user", userroutes);
app.use("/api/prefetch", prefetchroutes);

app.listen(3400, (err) => {
  if (err) {
    return console.log("Error: " + err);
  }
  console.log(`Server is listening on port 3400`);
});
