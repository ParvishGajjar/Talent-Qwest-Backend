import { query } from "../../index.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";

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
