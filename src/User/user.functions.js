import { query } from "../index.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { notEmpty } from "../Validation/apivalidations.js";

export const signup = async (req, res) => {
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  try {
    console.log(req.body.email, req.body.password, password);
    const result = await query(
      `insert into user_info (user_name, email, password) values ('${req.body.username}','${req.body.email}','${password}')`
    );

    if (result.insertId) {
      return res
        .status(200)
        .json({ data: true, message: `Sign Up successful`, status: true });
    } else {
      return res
        .status(400)
        .json({ data: false, message: `Something went wrong`, status: false });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const login = async (req, res) => {
  const user = await query(
    `select user_name, email, password from user_info where email='${req.body.email}';`
  );
  if (!user) {
    return req
      .status(404)
      .json({ data: false, message: `User not found`, status: true });
  }
  try {
    const passwordCompare = compareSync(req.body.password, user[0].password);
    if (passwordCompare) {
      user[0].password = undefined;
      let jsontoken = "";
      jsontoken = sign({ result: user[0] }, "nph101", {
        expiresIn: "2h",
      });
      const updatetoken = query(
        `update user_info set token='${jsontoken}' where email='${user[0].email}'`
      );
      if (!updatetoken) {
        return res.status(400).json({
          data: false,
          message: "something went wrong",
          status: false,
        });
      }
      return res.status(200).json({
        data: true,
        message: "login successfully",
        token: jsontoken,
        status: true,
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Invalid email or password",
        status: false,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const getUsers = async (req, res) => {
  try {
    console.log(req.user);
    const result = await query(`select * from user_info`);
    if (result) {
      return res.status(200).json({
        data: result,
        message: "Data fetch",
        status: true,
      });
    } else {
      return res
        .status(404)
        .json({ data: [], message: `No user found`, status: true });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

// Function to insert user location.
export const insertUserLocation = async (req, res) => {
  try {
    if (
      notEmpty(req.body.countryid) &&
      notEmpty(req.body.stateid) &&
      notEmpty(req.body.cityid)
    ) {
      const result = await query(
        `update user_info set country=${req.body.countryid},state=${req.body.stateid},city=${req.body.cityid} where id=${req.user[0].id}`
      );
      if (notEmpty(result)) {
        return res
          .status(200)
          .json({ data: true, message: "Data Updated", status: true });
      } else {
        throw "Couldn't Insert Data";
      }
    } else {
      throw "Body Parameter are Invalid";
    }
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ data: false, messgae: `Error: ${err}`, status: false });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    if (
      notEmpty(req.body.country) &&
      notEmpty(req.body.state) &&
      notEmpty(req.body.city)
    ) {
      var result = await query(
        `update user_info set country=${req.body.country},state=${req.body.state},city=${req.body.city} where id=${req.user[0].id}`
      );
      if (notEmpty(result)) {
        return res
          .status(200)
          .json({ data: true, message: "Data Updated", status: true });
      } else {
        throw "Couldn't Update Data";
      }
    } else {
      throw "Invalid Body Parameters";
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ data: false, messgae: `Error: ${error}`, status: false });
  }
};
