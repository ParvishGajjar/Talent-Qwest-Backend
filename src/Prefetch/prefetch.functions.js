import { query } from "../index.js";
import { notEmpty } from "../Validation/apivalidations.js";
// import * as _ from "lodash";

// Functiion to fetch all cities.
export const getCity = async (req, res) => {
  try {
    var sid = parseInt(req.params.sid);
    if (notEmpty(sid)) {
      const city = await query(`select * from cities where state_id=${sid};`);
      if (notEmpty(city)) {
        return res.status(200).json({
          data: city,
          message: `Cities fetched`,
          status: true,
        });
      } else {
        throw "Couldn't Fetch Cities";
      }
    } else {
      throw "Invalid StateID";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: true, message: `Error: ${err}`, status: true });
  }
};

// Function to fetch all states.
export const getState = async (req, res) => {
  try {
    var cid = parseInt(req.params.cid);
    if (notEmpty(cid)) {
      const state = await query(
        `select * from states where country_id=${cid};`
      );
      if (notEmpty(state)) {
        return res.status(200).json({
          data: state,
          message: `States fetched`,
          status: true,
        });
      } else {
        throw "Couldn't Fetch States.";
      }
    } else {
      throw "Invalid CountryID";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: true, message: `Error: ${err}`, status: true });
  }
};

// Function to fetch all countries.
export const getCountry = async (req, res) => {
  try {
    const country = await query(`select * from countries;`);
    if (notEmpty(country)) {
      return res.status(200).json({
        data: country,
        message: `Countries fetched`,
        status: true,
      });
    } else {
      throw "Couldn't Fetch Countries";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: false, message: `Error: ${err}`, status: false });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const result = await query(
      `select id,country,state,city from user_info where id=${req.user[0].id};`
    );
    if (notEmpty(result)) {
      console.log(result);
      return res
        .status(200)
        .json({ data: true, message: `${result}`, status: true });
    } else {
      throw "Couldn't Search/Find Data";
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ data: false, message: `Error: ${err}`, status: false });
  }
};
