import { query } from "../index";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { sendEmailVerifyLink } from "../auth/authentication";
import {
  validateSignUp,
  valiadteLogin,
  valiadtePageOne,
} from "../Validation/validatePageOne";
import * as jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { validationError, isValid } = validateSignUp(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  try {
    try {
      await query("begin;");
      console.log(req.body.email, req.body.password, password);
      const search = await query(
        `select * from user_info where email='${req.body.email}' and is_verified=1;`
      );
      if (search[0]) {
        return res.status(200).json({
          data: false,
          message: `User with this email id already exists`,
          status: false,
        });
      }
      const search1 = await query(
        `select * from user_info where email='${req.body.email}' and is_verified=0;`
      );
      var result = [];
      if (search1[0]) {
        result = await query(`update user_info set user_name='${req.body.username}', password='${password}'
        where id=${search1[0].id};`);
      } else {
        result = await query(
          `insert into user_info (user_name, email, password)
          values ('${req.body.username}','${req.body.email}','${password}');`
        );
      }
      if (result.insertId || result.affectedRows) {
        var jsontoken = "";
        jsontoken = sign(
          {
            result: {
              id: search1[0] ? search1[0].id : result.insertId,
              email: req.body.email,
            },
          },
          "itsme9",
          {
            expiresIn: "1d",
          }
        );
        const emailSent = await sendEmailVerifyLink(
          req.body,
          `http://13.235.170.141:3400/api/user/email-verify/${jsontoken}`
        );
        if (!emailSent) {
          return res.status(400).json({
            data: false,
            message: `Unable to send email. Please try again!`,
            status: false,
          });
        }
        await query(`commit;`);
        return res.status(200).json({
          data: true,
          message: `Verification email has been sent`,
          token: jsontoken,
          status: true,
        });
      }
    } catch (e) {
      console.log(e);
      await query(`rollback;`);
      return res
        .status(400)
        .json({ data: false, message: `fail`, status: false });
    }
  } catch (e) {
    console.log(`Error rolling back: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const emailVerify = async (req, res) => {
  try {
    if (req.params.token) {
      var token = req.params.token;
      jwt.verify(token, "itsme9", async (err, decoded) => {
        if (err) {
          return res.json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const check = await query(
            `select is_verified from user_info where id=${req.decoded.result.id}`
          );
          if (check[0].is_verified) {
            return res.send(`<h1> Your email is already verified! </h1>`);
          }
          const user = await query(
            `update user_info set is_verified = 1 where id=${req.decoded.result.id}`
          );
          if (user.affectedRows) {
            return res.send(
              `<h1>Email Verified! Return to Login page to signin</h1>`
            );
          } else {
            return res.send(`<h1>Something went wrong</h1>`);
          }
        }
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Access Denied! Unauthorized User",
        status: false,
      });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const resendEmailLink = async (req, res) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      var slicedToken = token.slice(7);
      jwt.verify(slicedToken, "itsme9", async (err, decoded) => {
        if (err) {
          return res.json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const emailSent = await sendEmailVerifyLink(
            { id: req.decoded.result.id, email: req.decoded.result.email },
            `http://13.235.170.141:3400/user/api/email-verify/${slicedToken}`
          );
          if (!emailSent) {
            return res.status(400).json({
              data: false,
              message: `Unable to send email. Please try again!`,
              status: false,
            });
          }
          return res.status(200).json({
            data: true,
            message: `Verification email has been sent`,
            token: slicedToken,
            status: true,
          });
        }
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Access Denied! Unauthorized User",
        status: false,
      });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

export const login = async (req, res) => {
  const { validationError, isValid } = valiadteLogin(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const user = await query(
      `select id, email, password, is_verified from user_info where email='${req.body.email}';`
    );
    if (!user[0]) {
      return res
        .status(404)
        .json({ data: false, message: `User not found`, status: false });
    }
    if (!user[0].is_verified) {
      var jsontoken = "";
      jsontoken = sign(
        { result: { id: user[0].id, email: user[0].email } },
        "itsme9",
        {
          expiresIn: "1d",
        }
      );
      const emailSent = await sendEmailVerifyLink(
        req.body,
        `http://13.235.170.141:3400/api/user/email-verify/${jsontoken}`
      );
      if (!emailSent) {
        return res.status(400).json({
          data: false,
          message: `Unable to send email. Please try again!`,
          status: false,
        });
      }
      await query(`commit;`);
      return res.status(200).json({
        data: true,
        message: `Verification email has been sent`,
        token: jsontoken,
        is_verified: 0,
        status: true,
      });
    }
    const passwordCompare = compareSync(req.body.password, user[0].password);
    if (passwordCompare) {
      let jsontoken = "";
      jsontoken = sign({ result: { id: user[0].id } }, "nph101", {
        expiresIn: "2h",
      });
      const updatetoken = query(
        `update user_info set token='${jsontoken}' where id='${user[0].id}'`
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
        is_verified: 1,
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

export const getAllUsers = async (req, res) => {
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

export const pageOne = async (req, res) => {
  const { validationError, isValid } = valiadtePageOne(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    const result = await query(`update user_info set firstname = '${req.body.firstname}', lastname = '${req.body.lastname}',
    phoneno = ${req.body.phoneno}, birthdate='${req.body.dob}', address = '${req.body.address}', country='${req.body.country}'
    , state = '${req.body.state}', city = '${req.body.city}', usertype = 1 where id=${req.user[0].id}`);
    if (result.affectedRows) {
      return res
        .status(200)
        .json({ data: true, message: `Data updated`, status: true });
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
