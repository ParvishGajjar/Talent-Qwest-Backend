import { query } from "../index.js";
import { notEmpty } from "../Validation/checkempty.js";
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
        .json({ data: result, message: `Data fetched`, status: true });
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

export const getSkills = async (req, res) => {
  try {
    const result = await query(`select * from skill_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Skills fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No skill found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getServices = async (req, res) => {
  try {
    const result = await query(`select * from service_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Services fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No service found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getHobbies = async (req, res) => {
  try {
    const result = await query(`select * from hobby_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Hobbies fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No hobby found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const result = await query(`select * from language_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({ data: result, message: `Languages fetched`, status: true });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No language found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getQualifications = async (req, res) => {
  try {
    const result = await query(`select * from qualifcation_list;`);
    if (result[0]) {
      return res
        .status(200)
        .json({
          data: result,
          message: `Qualifications fetched`,
          status: true,
        });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No qualification found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};
